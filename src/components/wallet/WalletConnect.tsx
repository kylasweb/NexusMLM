import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  ArrowRightLeft,
  Copy,
  ExternalLink,
  Check,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

const WalletConnect = ({
  onConnect,
  onDisconnect,
}: WalletConnectProps = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if wallet was previously connected
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
      setIsConnected(true);
      setBalance("0.05"); // Mock balance
      onConnect?.(savedAddress);
    }
  }, [onConnect]);

  const connectWallet = async () => {
    try {
      // Mock wallet connection
      // In a real implementation, you would use a library like ethers.js or web3.js
      // to connect to MetaMask or other wallets
      const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

      setWalletAddress(mockAddress);
      setIsConnected(true);
      setBalance("0.05"); // Mock balance
      localStorage.setItem("walletAddress", mockAddress);

      onConnect?.(mockAddress);

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

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
    setBalance("0");
    localStorage.removeItem("walletAddress");

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
