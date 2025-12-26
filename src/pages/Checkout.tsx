import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, HelpCircle, ShieldCheck, Shield } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

const Checkout = () => {
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [phone, setPhone] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [billingAddress, setBillingAddress] = useState("same");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const cartItems: CartItem[] = [
    {
      id: 1,
      name: "Royal Kundan Pearl Choker Set",
      variant: "Gold / Standard",
      price: 4500,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Antique Gold Finish Bangle Set",
      variant: "Size 2.4",
      price: 2800,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment submission
    console.log("Processing payment...");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">&gt;</span>
            <Link to="/cart" className="text-muted-foreground hover:text-primary transition-colors">
              Cart
            </Link>
            <span className="text-muted-foreground">&gt;</span>
            <span className="text-foreground font-medium">Checkout</span>
          </nav>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
              {/* Left Column - Form */}
              <div className="w-full lg:w-3/5 xl:w-2/3">
                {/* Contact Section */}
                <div className="mb-10">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-display text-2xl font-medium text-foreground">Contact</h2>
                    <Link to="#" className="text-sm text-primary underline">
                      Log in
                    </Link>
                  </div>
                  <Input
                    type="email"
                    placeholder="Email or mobile phone number"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-3"
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="newsletter"
                      checked={newsletter}
                      onCheckedChange={(checked) => setNewsletter(checked as boolean)}
                    />
                    <Label htmlFor="newsletter" className="text-sm text-muted-foreground">
                      Email me with news and offers
                    </Label>
                  </div>
                </div>

                {/* Delivery Section */}
                <div className="mb-10">
                  <h2 className="font-display text-2xl font-medium text-foreground mb-6">Delivery</h2>
                  <div className="space-y-4">
                    <Select defaultValue="india">
                      <SelectTrigger>
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex flex-col md:flex-row gap-4">
                      <Input
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="flex-1"
                      />
                    </div>

                    <Input
                      placeholder="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />

                    <Input
                      placeholder="Apartment, suite, etc. (optional)"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                    />

                    <div className="flex flex-col md:flex-row gap-4">
                      <Input
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={state} onValueChange={setState}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                          <SelectItem value="gujarat">Gujarat</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="PIN code"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        className="flex-1"
                      />
                    </div>

                    <div className="relative">
                      <Input
                        type="tel"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <HelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <Checkbox
                        id="save-info"
                        checked={saveInfo}
                        onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                      />
                      <Label htmlFor="save-info" className="text-sm text-muted-foreground">
                        Save this information for next time
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="mb-10">
                  <h2 className="font-display text-2xl font-medium text-foreground mb-4">
                    Shipping method
                  </h2>
                  <div className="bg-muted border border-border rounded-sm p-4 text-sm text-muted-foreground italic">
                    Enter your shipping address to view available shipping methods.
                  </div>
                </div>

                {/* Payment Section */}
                <div className="mb-10">
                  <h2 className="font-display text-2xl font-medium text-foreground mb-2">Payment</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    All transactions are secure and encrypted.
                  </p>

                  <div className="border border-border rounded-sm overflow-hidden">
                    {/* Credit/Debit Card Option */}
                    <div className="bg-muted p-4 border-b border-border">
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="text-sm font-medium cursor-pointer">
                              Credit/Debit Card
                            </Label>
                          </div>
                          <div className="flex gap-1">
                            <span className="px-1 py-0.5 border border-border bg-background rounded text-[10px] font-bold text-blue-800">
                              VISA
                            </span>
                            <span className="px-1 py-0.5 border border-border bg-background rounded text-[10px] font-bold text-orange-600">
                              MC
                            </span>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Card Details */}
                    {paymentMethod === "card" && (
                      <div className="bg-background p-6 border-b border-border">
                        <div className="space-y-4">
                          <div className="relative">
                            <Input
                              placeholder="Card number"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                            />
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <Input
                                placeholder="Expiration date (MM / YY)"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                              />
                            </div>
                            <div className="flex-1 relative">
                              <Input
                                placeholder="Security code"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                              />
                              <HelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                          <Input
                            placeholder="Name on card"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {/* UPI Option */}
                    <div className="p-4 flex items-center justify-between hover:bg-muted transition-colors">
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi" className="text-sm font-medium cursor-pointer">
                            UPI / NetBanking
                          </Label>
                        </div>
                      </RadioGroup>
                      <div className="flex gap-1 opacity-60 grayscale">
                        <span className="px-1 py-0.5 border border-border bg-background rounded text-[10px] font-bold">
                          UPI
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="mb-10">
                  <h2 className="font-display text-2xl font-medium text-foreground mb-4">
                    Billing address
                  </h2>
                  <RadioGroup value={billingAddress} onValueChange={setBillingAddress}>
                    <div className="border border-border rounded-sm overflow-hidden">
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="same" id="same_billing" />
                          <Label htmlFor="same_billing" className="text-sm font-medium cursor-pointer">
                            Same as shipping address
                          </Label>
                        </div>
                      </div>
                      <div className="p-4 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="different" id="diff_billing" />
                          <Label htmlFor="diff_billing" className="text-sm font-medium cursor-pointer">
                            Use a different billing address
                          </Label>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Pay Now Button */}
                <Button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-6 text-lg font-bold uppercase tracking-widest shadow-lg transition-all transform hover:-translate-y-0.5 mb-8 lg:mb-0"
                >
                  Pay now
                </Button>

                {/* Policy Links */}
                <div className="mt-8 flex flex-wrap gap-6 text-xs text-primary underline">
                  <Link to="#">Refund policy</Link>
                  <Link to="#">Shipping policy</Link>
                  <Link to="#">Privacy policy</Link>
                  <Link to="#">Terms of service</Link>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="w-full lg:w-2/5 xl:w-1/3">
                <div className="bg-card p-6 md:p-8 shadow-sm border border-border rounded-sm sticky top-28">
                  {/* Order Items */}
                  <div className="space-y-6 mb-8 border-b border-border pb-8">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-background border border-border rounded-sm overflow-hidden p-1">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                          <span className="absolute -top-1 -right-1 bg-muted-foreground text-background text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-sm font-medium text-foreground leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">{item.variant}</p>
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code */}
                  <div className="flex gap-2 mb-8 pb-8 border-b border-border">
                    <Input
                      placeholder="Discount code or gift card"
                      className="flex-1"
                    />
                    <Button variant="secondary" className="bg-muted hover:bg-muted/80 text-muted-foreground">
                      Apply
                    </Button>
                  </div>

                  {/* Price Summary */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span className="flex items-center gap-1">
                        Shipping
                        <HelpCircle className="w-3 h-3" />
                      </span>
                      <span className="text-xs text-muted-foreground">Calculated at next step</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax</span>
                      <span className="text-xs text-muted-foreground">Inclusive</span>
                    </div>
                    <div className="border-t border-border pt-4 mt-4 flex justify-between items-center">
                      <span className="font-display text-lg font-medium text-foreground">Total</span>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground mr-2">INR</span>
                        <span className="font-bold text-2xl text-foreground">
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Icons */}
                  <div className="mt-8 pt-6 border-t border-border flex justify-center gap-4 text-muted-foreground">
                    <Lock className="w-6 h-6" />
                    <ShieldCheck className="w-6 h-6" />
                    <Shield className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
