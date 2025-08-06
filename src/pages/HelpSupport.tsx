import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Search,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const HelpSupport = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });

  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supportForm.name || !supportForm.email || !supportForm.subject || !supportForm.message) {
      toast({
        title: language === 'en' ? "Error" : "त्रुटि",
        description: language === 'en' ? "Please fill in all fields" : "कृपया सभी फ़ील्ड भरें",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would submit to backend
    toast({
      title: language === 'en' ? "Support Request Submitted" : "सहायता अनुरोध सबमिट किया गया",
      description: language === 'en' 
        ? "We'll get back to you within 24 hours" 
        : "हम 24 घंटे के भीतर आपसे संपर्क करेंगे"
    });

    setSupportForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "general"
    });
  };

  const faqs = [
    {
      question: language === 'en' ? "How do I create a profile?" : "मैं प्रोफ़ाइल कैसे बनाऊं?",
      answer: language === 'en' 
        ? "To create a profile, sign up with your email, verify your account, and complete your profile information including skills, experience, and contact details."
        : "प्रोफ़ाइल बनाने के लिए, अपने ईमेल से साइन अप करें, अपना खाता सत्यापित करें, और कौशल, अनुभव और संपर्क विवरण सहित अपनी प्रोफ़ाइल जानकारी पूरी करें।"
    },
    {
      question: language === 'en' ? "How do I find jobs?" : "मैं नौकरी कैसे खोजूं?",
      answer: language === 'en' 
        ? "Use the 'View Jobs' section to browse available positions. You can filter by category, location, salary range, and other criteria to find jobs that match your skills."
        : "'नौकरी देखें' अनुभाग का उपयोग करके उपलब्ध पदों को ब्राउज़ करें। आप अपने कौशल से मेल खाने वाली नौकरियां खोजने के लिए श्रेणी, स्थान, वेतन सीमा और अन्य मानदंडों के अनुसार फ़िल्टर कर सकते हैं।"
    },
    {
      question: language === 'en' ? "How do I post a job?" : "मैं नौकरी कैसे पोस्ट करूं?",
      answer: language === 'en' 
        ? "Go to 'Post Job' section, fill in the job details including title, description, requirements, budget, and contact information. Your job will be visible to all students once posted."
        : "'नौकरी पोस्ट करें' अनुभाग में जाएं, शीर्षक, विवरण, आवश्यकताएं, बजट और संपर्क जानकारी सहित नौकरी का विवरण भरें। पोस्ट करने के बाद आपकी नौकरी सभी छात्रों को दिखाई देगी।"
    },
    {
      question: language === 'en' ? "How do I save jobs?" : "मैं नौकरियां कैसे सेव करूं?",
      answer: language === 'en' 
        ? "Click the bookmark icon on any job listing to save it. You can view all your saved jobs in the 'Saved Jobs' section from your profile menu."
        : "किसी भी नौकरी की सूची पर बुकमार्क आइकन पर क्लिक करके इसे सेव करें। आप अपने प्रोफ़ाइल मेनू से 'सेव की गई नौकरियां' अनुभाग में अपनी सभी सेव की गई नौकरियां देख सकते हैं।"
    },
    {
      question: language === 'en' ? "How do I change my language?" : "मैं अपनी भाषा कैसे बदलूं?",
      answer: language === 'en' 
        ? "Click the language toggle button in the top navigation. You can switch between English and Hindi at any time."
        : "शीर्ष नेवीगेशन में भाषा टॉगल बटन पर क्लिक करें। आप किसी भी समय अंग्रेजी और हिंदी के बीच स्विच कर सकते हैं।"
    },
    {
      question: language === 'en' ? "How do I update my profile?" : "मैं अपनी प्रोफ़ाइल कैसे अपडेट करूं?",
      answer: language === 'en' 
        ? "Go to your profile page and click 'Edit Profile'. You can update your personal information, skills, experience, and preferences."
        : "अपने प्रोफ़ाइल पेज पर जाएं और 'प्रोफ़ाइल संपादित करें' पर क्लिक करें। आप अपनी व्यक्तिगत जानकारी, कौशल, अनुभव और प्राथमिकताएं अपडेट कर सकते हैं।"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const supportCategories = [
    { 
      id: "account", 
      label: language === 'en' ? "Account Issues" : "खाता समस्याएं",
      icon: <AlertCircle className="h-5 w-5" />
    },
    { 
      id: "technical", 
      label: language === 'en' ? "Technical Support" : "तकनीकी सहायता",
      icon: <HelpCircle className="h-5 w-5" />
    },
    { 
      id: "general", 
      label: language === 'en' ? "General Inquiry" : "सामान्य पूछताछ",
      icon: <MessageCircle className="h-5 w-5" />
    },
    { 
      id: "billing", 
      label: language === 'en' ? "Billing" : "बिलिंग",
      icon: <FileText className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            {language === 'en' ? 'Help & Support' : 'सहायता और समर्थन'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {language === 'en' ? 'Contact Information' : 'संपर्क जानकारी'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">support@shiftbuddy.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{language === 'en' ? 'Phone' : 'फ़ोन'}</p>
                    <p className="text-sm text-muted-foreground">+91 1800-123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{language === 'en' ? 'Hours' : 'समय'}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Mon-Fri: 9AM-6PM IST' : 'सोम-शुक्र: 9AM-6PM IST'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Response Times' : 'प्रतिक्रिया समय'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{language === 'en' ? 'Email' : 'ईमेल'}</span>
                  <Badge variant="outline">
                    {language === 'en' ? '24 hours' : '24 घंटे'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{language === 'en' ? 'Phone' : 'फ़ोन'}</span>
                  <Badge variant="outline">
                    {language === 'en' ? 'Immediate' : 'तुरंत'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{language === 'en' ? 'General' : 'सामान्य'}</span>
                  <Badge variant="outline">
                    {language === 'en' ? '48 hours' : '48 घंटे'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  {language === 'en' ? 'Frequently Asked Questions' : 'अक्सर पूछे जाने वाले प्रश्न'}
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={language === 'en' ? 'Search FAQs...' : 'FAQ खोजें...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredFaqs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {language === 'en' ? 'No FAQs found matching your search' : 'आपकी खोज से मेल खाने वाले कोई FAQ नहीं मिले'}
                  </p>
                ) : (
                  <Accordion type="single" collapsible>
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>

            {/* Support Request Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {language === 'en' ? 'Submit Support Request' : 'सहायता अनुरोध सबमिट करें'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitSupport} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">
                        {language === 'en' ? 'Name' : 'नाम'} *
                      </Label>
                      <Input
                        id="name"
                        value={supportForm.name}
                        onChange={(e) => setSupportForm({...supportForm, name: e.target.value})}
                        placeholder={language === 'en' ? 'Enter your name' : 'अपना नाम दर्ज करें'}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">
                        {language === 'en' ? 'Email' : 'ईमेल'} *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={supportForm.email}
                        onChange={(e) => setSupportForm({...supportForm, email: e.target.value})}
                        placeholder={language === 'en' ? 'Enter your email' : 'अपना ईमेल दर्ज करें'}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">
                      {language === 'en' ? 'Category' : 'श्रेणी'}
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {supportCategories.map((category) => (
                        <Button
                          key={category.id}
                          type="button"
                          variant={supportForm.category === category.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSupportForm({...supportForm, category: category.id})}
                          className="flex items-center gap-2 justify-start"
                        >
                          {category.icon}
                          <span className="text-xs">{category.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">
                      {language === 'en' ? 'Subject' : 'विषय'} *
                    </Label>
                    <Input
                      id="subject"
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                      placeholder={language === 'en' ? 'Brief description of your issue' : 'आपकी समस्या का संक्षिप्त विवरण'}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">
                      {language === 'en' ? 'Message' : 'संदेश'} *
                    </Label>
                    <Textarea
                      id="message"
                      value={supportForm.message}
                      onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                      placeholder={language === 'en' ? 'Provide detailed information about your issue...' : 'अपनी समस्या के बारे में विस्तृत जानकारी प्रदान करें...'}
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Submit Request' : 'अनुरोध सबमिट करें'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;