import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { Product } from "@prisma/client";
import { useState } from "react";
import { ProductWithQuantity } from "../../../../types/global";
import { Spinner } from "@/components/spinner";
import { unknown } from "zod";
import { toast } from "@/components/ui/use-toast";

type Props = {
  data: Product[];
  handleAddFn: Function;
};

export const AddingProduct = ({ data, handleAddFn }: Props) => {
  const [productSelected, setProductSelected] = useState<any>({
    discount: 0.0,
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    if (
      productSelected &&
      productSelected.quantity > 0 &&
      productSelected.discount > -1 &&
      productSelected.discount <= 100
    ) {
      setLoading(true);
      handleAddFn(productSelected);
      setLoading(false);
      setProductSelected({
        discount: 0,
        quantity: 1,
      });
    } else {
      toast({
        title: "Error",
        description: "Não pode ser numero negativo a quantidade e o desconto",
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"default"}
          onClick={() => ""}
          className="bg-green-600 hover:bg-green-500 flex-grow-[1]"
        >
          Adicionar produtos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Adicionando produto</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <TextField
              className="flex-grow-[1] flex "
              label="Quantidade"
              type="number"
              id="outlined-basic"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: 0,
              }}
              defaultValue={1}
              onChange={(e) =>
                setProductSelected((prevProductSelected: any) => ({
                  ...prevProductSelected,
                  quantity: parseInt(e.target.value),
                }))
              }
            />
            <TextField
              className="flex-grow-[1] flex "
              label="Desconto"
              type="number"
              id="outlined-basic"
              defaultValue={0}
              value={productSelected.discount}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">%</InputAdornment>
                ),
              }}
              onChange={(e) =>
                setProductSelected((prevProductSelected: any) => ({
                  ...prevProductSelected,
                  discount: parseFloat(e.target.value),
                }))
              }
            />
          </div>

          <Autocomplete
            disablePortal
            id="Selecione"
            key={new Date().toISOString()}
            getOptionLabel={(option) => option.description}
            options={data}
            sx={{ width: "100%", cursor: "pointer" }}
            value={productSelected?.product || undefined}
            onChange={(_, newValue) => {
              setProductSelected((prevProductSelected: any) => ({
                ...prevProductSelected,
                product: newValue!,
              }));
            }}
            isOptionEqualToValue={(option) => {
              return option.code === productSelected?.product?.code;
            }}
            renderInput={(params) => (
              <TextField key={`${params.id}`} {...params} label={params.id} />
            )}
          />

          <div className="">
            <TextField
              className="flex-grow-[1] flex "
              defaultValue={" "}
              label="Descrição"
              id="outlined-basic"
              disabled
              value={productSelected?.product?.description}
            />
          </div>
          <div className="flex gap-4">
            <TextField
              className="flex-grow-[1] flex "
              defaultValue={" "}
              label="Codigo"
              id="outlined-basic"
              disabled
              value={productSelected?.product?.code}
            />
            <TextField
              className="flex-grow-[1] flex "
              defaultValue={" "}
              label="Apres"
              id="outlined-basic"
              disabled
              value={productSelected?.product?.apres}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!productSelected?.product?.code ? true : false}
          >
            {loading ? (
              <Spinner className="w-5 h-5" />
            ) : (
              <DialogPrimitive.Close className="w-full">
                Adicionar
              </DialogPrimitive.Close>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
