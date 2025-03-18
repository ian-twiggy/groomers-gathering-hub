
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md animate-scale-in">
        <h1 className="text-6xl font-bold mb-6 text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! Parece que você tentou acessar uma página que não existe.
        </p>
        <Button asChild size="lg" className="rounded-full px-6 py-6 bg-gray-900 hover:bg-gray-800">
          <Link to="/" className="flex items-center">
            <Home className="mr-2 h-5 w-5" />
            Voltar para a página inicial
          </Link>
        </Button>
        
        <div className="mt-12 text-gray-500 text-sm">
          <p>
            Se você acredita que isso é um erro, por favor entre em contato com nosso suporte.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
