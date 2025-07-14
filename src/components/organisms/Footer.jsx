import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Footer = ({ className }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Shop",
      links: [
        { name: "All Products", path: "/shop" },
        { name: "Electronics", path: "/shop?category=Electronics" },
        { name: "Clothing", path: "/shop?category=Clothing" },
        { name: "Home & Garden", path: "/shop?category=Home%20%26%20Garden" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "#" },
        { name: "Shipping Info", path: "#" },
        { name: "Returns", path: "#" },
        { name: "Contact Us", path: "#" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", path: "#" },
        { name: "Careers", path: "#" },
        { name: "Press", path: "#" },
        { name: "Blog", path: "#" },
      ]
    }
  ];

  const paymentMethods = [
    "CreditCard",
    "Banknote",
    "Smartphone",
    "Wallet"
  ];

  return (
    <footer className={cn("bg-white border-t border-gray-200 mt-16", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <ApperIcon name="Store" className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold text-primary">Minimal Market</span>
            </Link>
            <p className="text-secondary text-sm">
              Clean, modern e-commerce experience with quality products and exceptional service.
            </p>
            <div className="flex space-x-4">
              <ApperIcon name="Facebook" className="h-5 w-5 text-secondary hover:text-primary cursor-pointer transition-colors" />
              <ApperIcon name="Twitter" className="h-5 w-5 text-secondary hover:text-primary cursor-pointer transition-colors" />
              <ApperIcon name="Instagram" className="h-5 w-5 text-secondary hover:text-primary cursor-pointer transition-colors" />
              <ApperIcon name="Linkedin" className="h-5 w-5 text-secondary hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-medium text-primary">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-secondary hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary text-sm">
              © {currentYear} Minimal Market. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-2">
              <span className="text-secondary text-sm">We accept:</span>
              <div className="flex space-x-2">
                {paymentMethods.map((method) => (
                  <div key={method} className="p-1 bg-gray-100 rounded">
                    <ApperIcon name={method} className="h-4 w-4 text-secondary" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;