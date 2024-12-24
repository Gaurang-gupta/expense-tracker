import { useUser } from "@clerk/clerk-react"
import { Link } from "react-router"
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

function Home() {
  const { user } = useUser()
  return (
    <div>
      { user ? <div>Home</div> : <HomePageIfNotLoggedIn/> }
    </div>
  )
}

export default Home


interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedSection: React.FC<SectionProps> = ({ children, className }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2, // Trigger animation when 20% of the section is visible
    triggerOnce: true, // Animate only the first time it comes into view
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};


const HomePageIfNotLoggedIn: React.FC = () => {
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="text-center py-10">
          <motion.h1
            className="text-4xl font-bold text-blue-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to ExpenseTracker Pro!
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Your Personal Finance Companion
          </motion.p>
        </header>

        {/* Highlight Section */}
        <AnimatedSection className="text-center py-8">
          <h2 className="text-3xl font-semibold">Track. Save. Prosper.</h2>
          <p className="mt-4 text-gray-600">
            Managing your finances doesn’t have to be stressful! ExpenseTracker Pro simplifies your financial journey.
          </p>
        </AnimatedSection>

        {/* Features Section */}
        <AnimatedSection className="py-10">
          <h3 className="text-2xl font-bold text-center mb-6">
            Why Choose ExpenseTracker Pro?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "🏷", title: "Effortless Expense Tracking", desc: "Easily log your daily expenses with just a few taps." },
              { emoji: "📊", title: "Detailed Insights", desc: "Get clear, customizable charts and reports." },
              { emoji: "💰", title: "Budget Planning Made Easy", desc: "Set monthly budgets and monitor your progress." },
              { emoji: "🔔", title: "Smart Notifications", desc: "Stay on top of bill payments and financial goals." },
              { emoji: "🛡", title: "Your Data is Safe", desc: "Your data remains secure and private with encryption." },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate="visible"
                variants={{
                  visible: { opacity: 1, y: 0, transition: { delay: index * 0.2, duration: 0.8 } },
                }}
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h4 className="text-xl font-semibold">{feature.title}</h4>
                <p className="mt-2 text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* How It Works Section */}
        <AnimatedSection className="py-10 bg-blue-50 rounded-lg shadow-md px-4">
          <h3 className="text-2xl font-bold text-center mb-6">How It Works</h3>
          <ol className="list-decimal list-inside space-y-4 max-w-lg mx-auto text-gray-700">
            <li>
              <strong>Create an Account:</strong> Sign up in seconds to get started.
            </li>
            <li>
              <strong>Add Expenses:</strong> Log your daily spending in different categories.
            </li>
            <li>
              <strong>Track Budgets:</strong> Set personalized budgets and monitor your progress.
            </li>
            <li>
              <strong>Analyze Spending:</strong> Use intuitive graphs to identify patterns.
            </li>
          </ol>
        </AnimatedSection>

        {/* Call to Action Section */}
        <AnimatedSection className="py-12 text-center">
          <h3 className="text-2xl font-bold">
            Join Thousands Who’ve Taken Control of Their Finances
          </h3>
          <p className="mt-4 text-gray-600">
            Whether you're saving for a big purchase, paying off debt, or simply want to spend smarter, ExpenseTracker Pro is your ultimate financial partner.
          </p>
          <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
            <Link to={"/sign-in"}>
              <motion.button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
              >
                Log In
              </motion.button>
            </Link>
            <Link to={"/sign-up"}>
              <motion.button
                className="bg-gray-100 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-200 transition duration-300 border border-blue-600"
                whileHover={{ scale: 1.05 }}
              >
                Sign Up
              </motion.button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};