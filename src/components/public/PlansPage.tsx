import React from "react";
import PublicLayout from "../layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";

const PlansPage = () => {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Investment Plans</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the investment plan that best suits your goals and start
            earning with our binary matrix system.
          </p>
        </div>

        {/* Plans Tabs */}
        <Tabs defaultValue="investment" className="mb-16">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="investment">Investment Plans</TabsTrigger>
              <TabsTrigger value="referral">Referral Program</TabsTrigger>
              <TabsTrigger value="compensation">
                Compensation Structure
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Investment Plans Tab */}
          <TabsContent value="investment">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Starter Plan",
                  price: "$100 - $500",
                  roi: "5%",
                  duration: "30 days",
                  features: [
                    "Daily ROI payouts",
                    "Access to basic tools",
                    "Email support",
                    "1 level of referral commissions",
                    "Bronze rank eligibility",
                  ],
                  popular: false,
                  color: "blue",
                },
                {
                  name: "Growth Plan",
                  price: "$500 - $2,000",
                  roi: "8%",
                  duration: "60 days",
                  features: [
                    "Daily ROI payouts",
                    "Access to advanced tools",
                    "Priority email support",
                    "3 levels of referral commissions",
                    "Silver rank eligibility",
                    "Team performance bonuses",
                  ],
                  popular: true,
                  color: "purple",
                },
                {
                  name: "Premium Plan",
                  price: "$2,000 - $10,000",
                  roi: "12%",
                  duration: "90 days",
                  features: [
                    "Daily ROI payouts",
                    "Access to all tools",
                    "24/7 dedicated support",
                    "5 levels of referral commissions",
                    "Gold rank eligibility",
                    "Team performance bonuses",
                    "Leadership bonuses",
                    "Exclusive training materials",
                  ],
                  popular: false,
                  color: "green",
                },
              ].map((plan, index) => (
                <Card
                  key={index}
                  className={`overflow-hidden ${plan.popular ? "border-2 border-blue-500 shadow-lg" : ""}`}
                >
                  {plan.popular && (
                    <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader
                    className={`bg-gradient-to-r ${plan.color === "blue" ? "from-blue-500 to-blue-600" : plan.color === "purple" ? "from-purple-500 to-purple-600" : "from-green-500 to-green-600"} text-white text-center py-8`}
                  >
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold mt-2">{plan.price}</div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex justify-between mb-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">ROI</div>
                        <div className="text-xl font-bold text-blue-600">
                          {plan.roi}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Duration</div>
                        <div className="text-xl font-bold text-blue-600">
                          {plan.duration}
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button
                      className={`w-full ${plan.color === "blue" ? "bg-blue-600 hover:bg-blue-700" : plan.color === "purple" ? "bg-purple-600 hover:bg-purple-700" : "bg-green-600 hover:bg-green-700"}`}
                    >
                      Get Started
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Referral Program Tab */}
          <TabsContent value="referral">
            <div className="max-w-4xl mx-auto">
              <div className="bg-blue-50 p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Our Referral Program
                </h2>
                <p className="text-center mb-6">
                  Earn generous commissions by referring new members to our
                  platform. Our multi-level referral program rewards you for
                  building and growing your network.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      level: "Level 1",
                      commission: "10%",
                      description: "Direct referrals",
                    },
                    {
                      level: "Level 2",
                      commission: "5%",
                      description: "Your referrals' referrals",
                    },
                    {
                      level: "Level 3",
                      commission: "3%",
                      description: "Extended network",
                    },
                  ].map((level, index) => (
                    <Card key={index}>
                      <CardContent className="p-6 text-center">
                        <h3 className="text-xl font-bold mb-2">
                          {level.level}
                        </h3>
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {level.commission}
                        </div>
                        <p className="text-gray-600">{level.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4">Example Scenario</h3>
                  <p className="mb-4">
                    If you refer someone who invests $1,000 in our Growth Plan:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>
                        You earn <strong>$100</strong> (10% of $1,000) as a
                        direct referral commission
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>
                        If they refer someone who invests $1,000, you earn an
                        additional <strong>$50</strong> (5% of $1,000)
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>
                        If that person refers someone who invests $1,000, you
                        earn another <strong>$30</strong> (3% of $1,000)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <Button size="lg">Join Our Referral Program</Button>
              </div>
            </div>
          </TabsContent>

          {/* Compensation Structure Tab */}
          <TabsContent value="compensation">
            <div className="max-w-4xl mx-auto">
              <div className="bg-blue-50 p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Binary Matrix Compensation Structure
                </h2>
                <p className="text-center mb-8">
                  Our binary matrix system allows you to build a network with
                  two legs (left and right). Commissions are calculated based on
                  the volume generated by your weaker leg.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      Binary Commissions
                    </h3>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            Earn 10% commission on the volume of your weaker leg
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            Commissions are calculated and paid out weekly
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            Unused volume in your stronger leg is carried over
                            to the next calculation period
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            Maximum weekly earnings increase with your rank
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4">Matching Bonus</h3>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            Earn a percentage of the binary commissions earned
                            by your personally referred members
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            Bronze Rank: 20% matching bonus on Level 1
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            Silver Rank: 20% on Level 1, 10% on Level 2
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            Gold Rank and above: 20% on Level 1, 10% on Level 2,
                            5% on Level 3
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-center">
                    Rank Advancement and Benefits
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-md">
                      <thead>
                        <tr className="bg-blue-600 text-white">
                          <th className="p-4 text-left">Rank</th>
                          <th className="p-4 text-left">Requirements</th>
                          <th className="p-4 text-left">Benefits</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            rank: "Bronze",
                            requirements:
                              "2 direct referrals (1 left, 1 right)",
                            benefits:
                              "20% matching bonus on Level 1, $1,000 weekly cap",
                          },
                          {
                            rank: "Silver",
                            requirements:
                              "4 direct referrals (2 left, 2 right), $5,000 group volume",
                            benefits:
                              "20% matching bonus on Level 1, 10% on Level 2, $2,500 weekly cap",
                          },
                          {
                            rank: "Gold",
                            requirements:
                              "6 direct referrals (3 left, 3 right), $10,000 group volume",
                            benefits:
                              "20% matching bonus on Level 1, 10% on Level 2, 5% on Level 3, $5,000 weekly cap",
                          },
                          {
                            rank: "Platinum",
                            requirements:
                              "8 direct referrals (4 left, 4 right), $25,000 group volume",
                            benefits:
                              "All Gold benefits plus leadership bonus pool, $10,000 weekly cap",
                          },
                          {
                            rank: "Diamond",
                            requirements:
                              "10 direct referrals (5 left, 5 right), $50,000 group volume",
                            benefits:
                              "All Platinum benefits plus global bonus pool, unlimited weekly earnings",
                          },
                        ].map((rank, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="p-4 font-medium">{rank.rank}</td>
                            <td className="p-4">{rank.requirements}</td>
                            <td className="p-4">{rank.benefits}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button size="lg">Join Now</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                question: "How do I get started with an investment plan?",
                answer:
                  "To get started, simply register an account, complete your profile, and select the investment plan that best suits your goals. You can then make a payment using one of our supported payment methods.",
              },
              {
                question: "When do I receive my ROI payments?",
                answer:
                  "ROI payments are calculated daily and credited to your account balance. You can withdraw your earnings at any time, subject to the minimum withdrawal amount.",
              },
              {
                question: "Is there a minimum withdrawal amount?",
                answer:
                  "Yes, the minimum withdrawal amount is $50. Withdrawals are processed within 24-48 hours depending on your chosen payment method.",
              },
              {
                question: "How does the binary matrix system work?",
                answer:
                  "Our binary matrix system allows you to build a network with two legs (left and right). You earn commissions based on the volume generated by your weaker leg. This encourages balanced team growth and maximizes your earning potential.",
              },
              {
                question: "Can I upgrade my investment plan?",
                answer:
                  "Yes, you can upgrade your investment plan at any time. The additional investment will be added to your current plan, and your ROI will be adjusted accordingly.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Investing?</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Join thousands of successful investors and start building your
            financial future today with our powerful MLM Matrix system.
          </p>
          <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
            Register Now
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PlansPage;
