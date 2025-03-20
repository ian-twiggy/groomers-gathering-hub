
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ContactImportProps {
  onImportContacts: (contacts: any[]) => void;
  isImporting: boolean;
}

const ContactImport: React.FC<ContactImportProps> = ({
  onImportContacts,
  isImporting
}) => {
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // This is a placeholder for parsing WhatsApp contact exports
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Simulating contacts from a CSV or JSON file
        const mockContacts = [
          { name: "João Silva", phone: "+5511987654321" },
          { name: "Maria Oliveira", phone: "+5511976543210" },
          { name: "Pedro Santos", phone: "+5511965432109" },
          { name: "Ana Souza", phone: "+5511954321098" },
          { name: "Carlos Pereira", phone: "+5511943210987" }
        ];
        
        onImportContacts(mockContacts);
        toast({
          title: "Contatos carregados",
          description: `${mockContacts.length} contatos encontrados no arquivo.`
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível ler o arquivo de contatos.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <Button variant="outline" className="flex items-center gap-2" asChild>
        <label>
          <Upload size={16} />
          <span>Importar Contatos</span>
          <Input 
            type="file" 
            accept=".csv,.json,.txt" 
            className="sr-only" 
            onChange={handleFileUpload}
          />
        </label>
      </Button>
    </div>
  );
};

export default ContactImport;
