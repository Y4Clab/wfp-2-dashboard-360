
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Globe, ShieldCheck, Truck } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full border-b bg-white/80 backdrop-blur-md z-10 fixed top-0 left-0">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-wfp-blue text-white font-semibold">
              WFP
            </div>
            <span className="text-lg font-semibold">WFP Admin Portal</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="#features" className="text-sm font-medium transition-colors hover:text-wfp-blue">
              Features
            </Link>
            <Link to="#security" className="text-sm font-medium transition-colors hover:text-wfp-blue">
              Security
            </Link>
            <Link to="#about" className="text-sm font-medium transition-colors hover:text-wfp-blue">
              About
            </Link>
            <Link to="/login">
              <Button variant="outline" className="rounded-full">
                Log In
              </Button>
            </Link>
          </nav>
          <div className="md:hidden">
            <Link to="/login">
              <Button variant="outline" className="rounded-full">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:py-40">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Streamlining WFP Operations with Intelligence
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Monitor, manage, and optimize food distribution missions with our secure and intuitive administrative dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/login">
                <Button size="lg" className="rounded-full px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="#features">
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-16 mx-auto"
          >
            <div className="relative mx-auto rounded-xl overflow-hidden shadow-elevated">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="WFP Dashboard" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4">Comprehensive Management Tools</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform provides all the tools you need to efficiently manage food distribution operations.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck className="h-8 w-8 text-wfp-blue" />,
                title: "Fleet Management",
                description: "Track, manage, and optimize your entire fleet of delivery vehicles in real-time."
              },
              {
                icon: <Globe className="h-8 w-8 text-wfp-blue" />,
                title: "Mission Tracking",
                description: "Monitor food distribution missions with real-time updates and location tracking."
              },
              {
                icon: <ShieldCheck className="h-8 w-8 text-wfp-blue" />,
                title: "Vendor Compliance",
                description: "Ensure all vendors meet WFP standards with comprehensive compliance tracking."
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-wfp-blue" />,
                title: "Analytics Dashboard",
                description: "Gain insights from comprehensive data analytics and performance metrics."
              },
              {
                icon: <ShieldCheck className="h-8 w-8 text-wfp-blue" />,
                title: "Secure Access",
                description: "Role-based access control ensures data security and proper authorization."
              },
              {
                icon: <Globe className="h-8 w-8 text-wfp-blue" />,
                title: "Global Operations",
                description: "Manage operations across different regions with localized insights."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-subtle hover-scale"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-wfp-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Operations?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-white/80">
              Join the WFP Admin Portal to streamline your food distribution operations with our intelligent management system.
            </p>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="rounded-full px-8">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-white text-wfp-blue font-semibold">
                WFP
              </div>
              <span className="text-lg font-semibold">WFP Admin Portal</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} WFP Admin Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
