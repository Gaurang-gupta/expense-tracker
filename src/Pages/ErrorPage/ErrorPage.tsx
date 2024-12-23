import { useNavigate } from "react-router"
import { useEffect } from "react"
function ErrorPage() {
  const navigate = useNavigate()
  useEffect(() => {
 
    navigate("/")
  }, [])
  return (
    <div className="min-h-screen w-full text-center pt-[40vh] text-3xl">
        Uhh. We cannot find the requested page
    </div>
  )
}

export default ErrorPage