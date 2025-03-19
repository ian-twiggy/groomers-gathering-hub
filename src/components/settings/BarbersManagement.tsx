
import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, User, Mail, Smartphone, Scissors, Trash2, Edit, Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

// Mock data for barbers
const initialBarbers = [
  {
    id: "1",
    name: "Carlos Silva",
    email: "carlos@barbearia.com",
    phone: "(11) 98765-4321",
    specialty: "Corte Clássico",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
  },
  {
    id: "2",
    name: "Pedro Oliveira",
    email: "pedro@barbearia.com",
    phone: "(11) 91234-5678",
    specialty: "Barba Estilizada",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1599351431613-18ef1fdd318e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
  },
];

const BarbersManagement = () => {
  const [barbers, setBarbers] = useState(initialBarbers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<typeof initialBarbers[0] | null>(null);
  const [newBarber, setNewBarber] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    imageUrl: "",
  });
  const { toast } = useToast();

  const handleAddBarber = () => {
    if (!newBarber.name || !newBarber.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e e-mail são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const barber = {
      id: (barbers.length + 1).toString(),
      ...newBarber,
      status: "active",
      imageUrl: newBarber.imageUrl || "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    };
    
    setBarbers([...barbers, barber]);
    setNewBarber({
      name: "",
      email: "",
      phone: "",
      specialty: "",
      imageUrl: "",
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Barbeiro adicionado",
      description: `${barber.name} foi adicionado com sucesso.`,
    });
  };

  const handleEditBarber = () => {
    if (!selectedBarber || !selectedBarber.name || !selectedBarber.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e e-mail são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const updatedBarbers = barbers.map((barber) =>
      barber.id === selectedBarber.id ? selectedBarber : barber
    );
    
    setBarbers(updatedBarbers);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Barbeiro atualizado",
      description: `Informações de ${selectedBarber.name} foram atualizadas.`,
    });
  };

  const handleDeleteBarber = () => {
    if (!selectedBarber) return;
    
    const updatedBarbers = barbers.filter((barber) => barber.id !== selectedBarber.id);
    setBarbers(updatedBarbers);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Barbeiro removido",
      description: `${selectedBarber.name} foi removido com sucesso.`,
    });
  };

  const getAvatarFallback = (name: string) => {
    const nameParts = name.split(" ");
    return nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gerenciamento de Barbeiros</CardTitle>
            <CardDescription>
              Adicione, edite ou remova barbeiros da sua equipe.
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle size={16} />
                Adicionar Barbeiro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Barbeiro</DialogTitle>
                <DialogDescription>
                  Preencha os dados para adicionar um barbeiro à sua equipe.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome completo*</Label>
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-gray-400" />
                    <Input
                      id="name"
                      placeholder="Nome do barbeiro"
                      value={newBarber.name}
                      onChange={(e) => setNewBarber({ ...newBarber, name: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail*</Label>
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={newBarber.email}
                      onChange={(e) => setNewBarber({ ...newBarber, email: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="flex items-center gap-2">
                    <Smartphone size={18} className="text-gray-400" />
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      value={newBarber.phone}
                      onChange={(e) => setNewBarber({ ...newBarber, phone: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <div className="flex items-center gap-2">
                    <Scissors size={18} className="text-gray-400" />
                    <Input
                      id="specialty"
                      placeholder="Ex: Corte degradê, barba, etc."
                      value={newBarber.specialty}
                      onChange={(e) => setNewBarber({ ...newBarber, specialty: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">URL da foto (opcional)</Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://exemplo.com/foto.jpg"
                    value={newBarber.imageUrl}
                    onChange={(e) => setNewBarber({ ...newBarber, imageUrl: e.target.value })}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddBarber}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Barbeiro</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {barbers.map((barber) => (
                <TableRow key={barber.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={barber.imageUrl} alt={barber.name} />
                        <AvatarFallback>{getAvatarFallback(barber.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{barber.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{barber.email}</p>
                      <p className="text-gray-500">{barber.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{barber.specialty}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        barber.status === "active" ? "bg-green-500" : "bg-gray-400"
                      }`}></div>
                      {barber.status === "active" ? "Ativo" : "Inativo"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog open={isEditDialogOpen && selectedBarber?.id === barber.id} 
                              onOpenChange={(open) => {
                                if (open) {
                                  setSelectedBarber(barber);
                                }
                                setIsEditDialogOpen(open);
                              }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" 
                                  onClick={() => setSelectedBarber(barber)}>
                            <Edit size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Barbeiro</DialogTitle>
                            <DialogDescription>
                              Atualize as informações do barbeiro.
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedBarber && (
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-name">Nome completo*</Label>
                                <Input
                                  id="edit-name"
                                  value={selectedBarber.name}
                                  onChange={(e) => setSelectedBarber({
                                    ...selectedBarber,
                                    name: e.target.value
                                  })}
                                />
                              </div>
                              
                              <div className="grid gap-2">
                                <Label htmlFor="edit-email">E-mail*</Label>
                                <Input
                                  id="edit-email"
                                  type="email"
                                  value={selectedBarber.email}
                                  onChange={(e) => setSelectedBarber({
                                    ...selectedBarber,
                                    email: e.target.value
                                  })}
                                />
                              </div>
                              
                              <div className="grid gap-2">
                                <Label htmlFor="edit-phone">Telefone</Label>
                                <Input
                                  id="edit-phone"
                                  value={selectedBarber.phone}
                                  onChange={(e) => setSelectedBarber({
                                    ...selectedBarber,
                                    phone: e.target.value
                                  })}
                                />
                              </div>
                              
                              <div className="grid gap-2">
                                <Label htmlFor="edit-specialty">Especialidade</Label>
                                <Input
                                  id="edit-specialty"
                                  value={selectedBarber.specialty}
                                  onChange={(e) => setSelectedBarber({
                                    ...selectedBarber,
                                    specialty: e.target.value
                                  })}
                                />
                              </div>
                              
                              <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    className={`flex items-center px-3 py-1 rounded-md gap-1 ${
                                      selectedBarber.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                    onClick={() => setSelectedBarber({
                                      ...selectedBarber,
                                      status: "active"
                                    })}
                                  >
                                    <Check size={16} />
                                    Ativo
                                  </button>
                                  <button
                                    type="button"
                                    className={`flex items-center px-3 py-1 rounded-md gap-1 ${
                                      selectedBarber.status !== "active"
                                        ? "bg-gray-100 text-gray-800"
                                        : "bg-gray-50 text-gray-500"
                                    }`}
                                    onClick={() => setSelectedBarber({
                                      ...selectedBarber,
                                      status: "inactive"
                                    })}
                                  >
                                    <X size={16} />
                                    Inativo
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleEditBarber}>Salvar Alterações</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={isDeleteDialogOpen && selectedBarber?.id === barber.id} 
                              onOpenChange={(open) => {
                                if (open) {
                                  setSelectedBarber(barber);
                                }
                                setIsDeleteDialogOpen(open);
                              }}>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm" 
                                  onClick={() => setSelectedBarber(barber)}>
                            <Trash2 size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Remover Barbeiro</DialogTitle>
                            <DialogDescription>
                              Tem certeza que deseja remover este barbeiro da sua equipe?
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedBarber && (
                            <div className="flex items-center gap-4 py-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={selectedBarber.imageUrl} alt={selectedBarber.name} />
                                <AvatarFallback>{getAvatarFallback(selectedBarber.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{selectedBarber.name}</h3>
                                <p className="text-sm text-gray-500">{selectedBarber.email}</p>
                                <p className="text-sm text-gray-500">{selectedBarber.specialty}</p>
                              </div>
                            </div>
                          )}
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteBarber}>
                              Remover
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        
        <CardFooter className="border-t pt-6">
          <p className="text-sm text-gray-500">
            Total de barbeiros: {barbers.length}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BarbersManagement;
