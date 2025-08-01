import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Heart, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">About ShiftBuddy</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connecting students with flexible work opportunities and helping businesses find reliable temporary staff.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To bridge the gap between students seeking flexible employment and businesses needing reliable temporary workers. 
                We make it easy for both parties to connect and create mutually beneficial working relationships.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Our Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Flexibility for students</li>
                <li>• Reliability for employers</li>
                <li>• Fair compensation</li>
                <li>• Building community</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Why Choose ShiftBuddy?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">For Students</h3>
              <p className="text-muted-foreground">
                Find flexible work that fits around your studies. Build experience and earn money on your schedule.
              </p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">For Businesses</h3>
              <p className="text-muted-foreground">
                Access a pool of motivated, reliable students ready to fill your temporary staffing needs quickly.
              </p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Focused</h3>
              <p className="text-muted-foreground">
                Building stronger connections between local businesses and student communities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;