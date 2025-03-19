import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowRightLeft, Copy, ExternalLink, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: true,
  providerOptions: {}
});

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

const WalletConnect = ({ onConnect, onDisconnect }: WalletConnectProps = {}) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  const connectWallet = async () => {
    try {
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const ethBalance = ethers.utils.formatEther(balance);

      setProvider(provider);
      setWalletAddress(address);
      setBalance(Number(ethBalance).toFixed(4));
      setIsConnected(true);
      onConnect?.(address);

      // Subscribe to accounts change
      instance.on("accountsChanged", handleAccountsChanged);
      instance.on("chainChanged", handleChainChanged);

      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setWalletAddress(accounts[0]);
      if (provider) {
        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(balance));
      }
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const disconnectWallet = () => {
    web3Modal.clearCachedProvider();
    setProvider(null);
    setIsConnected(false);
    setWalletAddress("");
    setBalance("0");
    onDisconnect?.();

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);

    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard.",
    });

    setTimeout(() => setIsCopied(false), 2000);
  };

  const viewOnExplorer = () => {
    // Mock function to open explorer
    window.open(`https://etherscan.io/address/${walletAddress}`, "_blank");
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
        <CardDescription>
          Connect your crypto wallet to make investments and receive rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Address:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {walletAddress.substring(0, 6)}...
                    {walletAddress.substring(walletAddress.length - 4)}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={viewOnExplorer}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Balance:</span>
                <span className="text-sm font-medium">{balance} ETH</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <Wallet className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-center text-gray-500 mb-4">
              Connect your wallet to access investment features and manage your
              rewards
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <div className="w-full space-y-2">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => window.open("/transactions", "_self")}
            >
              <ArrowRightLeft className="h-4 w-4" />
              View Transactions
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={disconnectWallet}
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WalletConnect;
