// import { useUser } from "@clerk/clerk-react"
import { Link } from "react-router"
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Wallet, BriefcaseBusiness, ChevronRight } from "lucide-react";
import { db } from "../../firebase"
import { doc, getDoc } from "firebase/firestore";
import ChartHelper from "@/components/ChartHelper/ChartHelper";
import { getUserEmail, getDisplayName } from "../../utils/authStorage";
import { useNavigate } from "react-router";
function Home() {
  const user = getUserEmail()
  const navigate = useNavigate()
  navigate(0)
  return (
    <div>
      { user ? 
      <HomePageIfLoggedIn/> 
      : <HomePageIfNotLoggedIn/> }
    </div>
  )
}

export default Home

const HomePageIfLoggedIn: React.FC = () => {
  const [liabilitiesValue, setLiabilitiesValue] = useState(0)
  const [networthValue, setNetworthValue] = useState(0)
  const [stockTotal, setStockTotal] = useState(0)
  const [mutualFundTotal, setMutualFundTotal] = useState(0)
  const [realEstateTotal, setRealEstateTotal] = useState(0)
  const [internationalTotal, setInternationalTotal] = useState(0)
  const [insuranceTotal, setInsuranceTotal] = useState(0)
  const [debtTotal, setDebtTotal] = useState(0)
  const [goldTotal, setGoldTotal] = useState(0)
  const [cryptoTotal, setCryptoTotal] = useState(0)
  const user = getUserEmail()
  const displayName = getDisplayName()

  const handleTotalNetworth = async() => {
    try {
      const userDocRef = await doc(db, 'users', user);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData) {
            // stocks
            let stockTotal = 0
            for(let i in userData?.indian_stocks){
              stockTotal += userData?.indian_stocks[i]?.Quantity * userData?.indian_stocks[i]?.Price
            }
            setStockTotal(stockTotal)

            // MFs
            let mutualFundTotal = 0
            for(let i in userData?.Equity_MFs){
              mutualFundTotal += (userData?.Equity_MFs[i]?.Quantity * userData?.Equity_MFs[i]?.nav)
            }
            setMutualFundTotal(mutualFundTotal)

            // Real_estate
            let realEstateTotal = 0
            for(let i in userData?.Real_estate){
              realEstateTotal += Number(userData?.Real_estate[i]?.value)
            }
            setRealEstateTotal(realEstateTotal)

            // international
            let internationalTotal = 0
            for(let i in userData?.international){
              internationalTotal += userData?.international[i]?.Quantity * userData?.international[i]?.Price
            }
            setInternationalTotal(internationalTotal)

            // insurance
            let insuranceTotal = 0
            for(let i in userData?.Insurance){
              insuranceTotal += userData?.Insurance[i]?.amount
            }
            setInsuranceTotal(insuranceTotal)

            // debt
            let debtTotal = 0
            for(let i in userData?.Debt){
              debtTotal += userData?.Debt[i]?.amount
            }
            setDebtTotal(debtTotal)

            // gold
            let goldTotal = 0
            for(let i in userData?.Gold){
              goldTotal += userData?.Gold[i]?.amount
            }
            setGoldTotal(goldTotal)

            // crypto
            let cryptoTotal = 0
            for(let i in userData?.Crypto){
              cryptoTotal += userData?.Crypto[i]?.price
            }
            setCryptoTotal(cryptoTotal)

            // liabilities
            let liabilitiesTotal = 0
            for(let i in userData?.Liabilities){
              liabilitiesTotal += userData?.Liabilities[i]?.price
            }

            setLiabilitiesValue(liabilitiesTotal)
            setNetworthValue(stockTotal + mutualFundTotal + realEstateTotal + internationalTotal + insuranceTotal + debtTotal + goldTotal + cryptoTotal);
          } else {
              console.log("No stocks found.");
          }
      } else {
          console.log("No such document!");
      }
    } catch (error) {
        console.error("Error fetching document: ", error);
    }
  }

  useEffect(() => {
    handleTotalNetworth()
  }, [user])
 
  return (
    <div className="max-w-6xl mx-auto p-5 pt-10">
      <h1 className="text-3xl font-semibold">Home</h1>
      <h1 className="text-4xl font-bold mt-10">Hi, {displayName}!</h1>
      <h2 className="text-2xl text-gray-500 mt-5 font-semibold">Here is your Financial Summary</h2>

      <div className="grid xs:grid:cols-1 md:grid-cols-2 gap-10 mt-4">
        <div className="bg-white p-5 flex items-center rounded-lg">
          <div className="shadow-bottom-right mr-5 rounded-lg">
            <Wallet size={48} className="p-3"/>
          </div>

          <div>
            <h2 className="text-xl text-gray-400 font-semibold">Networth</h2>
            <h2 className="text-2xl font-semibold mt-1">
            {new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(
              networthValue
            )}
            </h2>
          </div>
        </div>

        <div className="bg-white p-5 flex items-center rounded-lg">
          <div className="shadow-bottom-right mr-5 rounded-lg">
            <BriefcaseBusiness size={48} className="p-3"/>
          </div>

          <div>
            <h2 className="text-xl text-gray-400 font-semibold">Liabilities</h2>
            <h2 className="text-2xl font-semibold mt-1">
            {new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(
              liabilitiesValue
            )}
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-7 text-2xl font-semibold">
        <h1 className="mb-4">Current Investments:</h1>
        <div className="grid xs:grid-cols-1 md:grid-cols-2 gap-5">
          {/* table */}
          <div className="grid grid-cols-1 gap-3 h-[550px] overflow-y-scroll">
            {/* equity */}
            <div className="bg-white p-4 rounded-xl">
              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg text-gray-400">Equity</h2>
                    <h3>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(stockTotal + mutualFundTotal)}</h3>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 mt-4">
                <Link to={"/indian-stocks"} className="flex items-center justify-between mr-3">
                  <div>
                    <h4 className="text-sm text-gray-400">Indian Stocks</h4>
                    <h4 className="text-lg">{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(stockTotal)}</h4>
                  </div>
                  <div>
                    <ChevronRight/>
                  </div>
                </Link>

                <Link to={"/equity-mfs"} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm text-gray-400">MFs</h4>
                    <h4 className="text-lg">{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(mutualFundTotal)}</h4>
                  </div>
                  <div>
                    <ChevronRight/>
                  </div>
                </Link>
              </div>
            </div>

            {/* real-estate */}
            <Link to={"/real-estate"} className="bg-white p-4 rounded-xl">
              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg text-gray-400">Real Estate</h2>
                    <h3>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(realEstateTotal)}</h3>
                  </div>
                  <div>
                    <ChevronRight />
                  </div>
                </div>
              </div>
            </Link>

            {/* international */}
            <Link to={"/international"} className="bg-white p-4 rounded-xl">
              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg text-gray-400">International</h2>
                    <h3>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(internationalTotal)}</h3>
                  </div>
                  <div>
                    <ChevronRight />
                  </div>
                </div>
              </div>
            </Link>

            {/* debt */}
            <Link to={"/debt"} className="bg-white p-4 rounded-xl">
              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg text-gray-400">Debt</h2>
                    <h3>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(debtTotal)}</h3>
                  </div>
                  <div>
                    <ChevronRight />
                  </div>
                </div>
              </div>
            </Link>

            {/* gold */}
            <Link to={"/gold"} className="bg-white p-4 rounded-xl">
              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg text-gray-400">Gold</h2>
                    <h3>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(goldTotal)}</h3>
                  </div>
                  <div>
                    <ChevronRight />
                  </div>
                </div>
              </div>
            </Link>

            {/* Crypto */}
            <Link to={"/crypto"} className="bg-white p-4 rounded-xl">
              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg text-gray-400">Crypto</h2>
                    <h3>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(cryptoTotal)}</h3>
                  </div>
                  <div>
                    <ChevronRight />
                  </div>
                </div>
              </div>
            </Link>      

            {/* Insurance */}
            <Link to={"/insurance"} className="bg-white p-4 rounded-xl">
              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg text-gray-400">Insurance</h2>
                    <h3>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(insuranceTotal)}</h3>
                  </div>
                  <div>
                    <ChevronRight />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* chart */}
          <div className="rounded-lg grid grid-cols-1 gap-3">
            <ChartHelper
             equityTotal={stockTotal + mutualFundTotal}
             realEstateTotal={realEstateTotal}
             internationalTotal={internationalTotal}
             insuranceTotal={insuranceTotal}
             debtTotal={debtTotal}
             goldTotal={goldTotal}
             cryptoTotal={cryptoTotal}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


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
                className="bg-blue-600 w-full text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
              >
                Log In
              </motion.button>
            </Link>
            <Link to={"/sign-up"}>
              <motion.button
                className="bg-gray-100 w-full text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-200 transition duration-300 border border-blue-600"
                whileHover={{ scale: 1.05 }}
              >
                Sign Up
              </motion.button>
            </Link>
          </div>
        </AnimatedSection>

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

        
      </div>
    </div>
  );
};