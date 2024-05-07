"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { createOrder } from "./schema";
import { DatePicker } from "@/components/ui/data-picker";
import { Autocomplete, TextField } from "@mui/material";
import { Client, Product } from "@prisma/client";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DataTableCart } from "./table/table-product";
import { Products, columnsProduct } from "./table/column";
import { AddingProduct } from "./adding-product";
import { ProductWithQuantity } from "../../../../types/global";
import { CalculateDiscount } from "@/lib/calculate-discount";
import { sendProcess } from "@/services/process";
import { ConstructionIcon } from "lucide-react";
import { Spinner } from "@/components/spinner";
import { toast } from "@/components/ui/use-toast";

const data: Client[] = [
  {
    classification: "123",
    code: "123",
    id: "12",
    identification: "12",
    name: "12",
    stateRegistration: "12",
    tell: "123",
    userId: "123",
  },
];
const options = [
  { table: "table1", name: "Tabela 01" },
  { table: "table2", name: "Tabela 02" },
  { table: "table3", name: "Tabela 03" },
];

type Props = {
  products: Product[];
  clients: Client[];
};
export const FormHome = ({ products, clients }: Props) => {
  const [client, setClient] = useState<Client | null>(null);
  const form = useForm<z.infer<typeof createOrder>>({
    resolver: zodResolver(createOrder),
    defaultValues: {
      date: new Date(),
      client: client ? { ...client } : {},
      conveyor: "",
      tablePrice: { table: "table1", name: "Tabela 01" },
      products: [],
    },
  });
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (client) {
      form.reset({ ...form.getValues(), client: { ...client } });
    }
  }, [client, form]);

  const addProductToForm = (newProduct: ProductWithQuantity) => {
    const currentProducts = form.getValues("products");
    currentProducts.push({
      ...newProduct,
      table: form.getValues().tablePrice.table,
    });

    // handleCalculateValue(currentProducts);
    form.setValue("products", currentProducts);
  };
  const onSubmit = async (data: z.infer<typeof createOrder>) => {
    setLoading(true);
    const { status } = await sendProcess({
      client: data.client,
      date: data.date,
      observation: data.observation,
      transportant: data.conveyor,
      planSell: data.planSell,
      products: data.products,
      table: data.tablePrice.table as any,
      total: value,
    });
    setLoading(false);
    if (status === 200) {
      toast({
        title: "Solicitado com sucesso",
      });
      form.reset();
    } else {
      toast({
        title: "Error",
        variant: "destructive",
      });
    }
  };
  const handleDelete = (product: Products) => {
    const currentProducts = form.getValues("products");
    console.log(product);
    const productFilter = currentProducts.filter(
      (p) => product.product.id != p.product.id
    );
    form.setValue("products", productFilter);
  };
  const handleCalculateValue = () => {
    let total = 0;
    form.getValues("products").forEach((e) => {
      let val = CalculateDiscount({
        discount: e.discount,
        //@ts-expect-error
        price: parseFloat(e.product[form.getValues().tablePrice.table]),
        quantity: e.quantity,
      });
      total += val;
    });
    setValue(total);
  };
  useEffect(() => {
    handleCalculateValue();
  }, [form.watch("products")]);
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col flex-grow-[1]">
              <FormLabel>Data</FormLabel>
              <FormControl>
                <DatePicker onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="relative rounded-md p-4 bg-white border-border border-[1px] flex flex-wrap gap-4 w-full flex-1 ">
          <span className="absolute top-[-13px] bg-white px-3">Cliente</span>
          <Controller
            name="client"
            control={form.control}
            render={({ field }) => (
              <Autocomplete
                disablePortal
                id="Selecione"
                key={new Date().toISOString()}
                className="mt-4"
                getOptionLabel={(option) => option.name}
                options={clients}
                sx={{ width: "100%", cursor: "pointer" }}
                value={client}
                onChange={(_, newValue) => {
                  setClient(newValue);
                  field.onChange(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    key={`${params.id}`}
                    {...params}
                    label={params.id}
                  />
                )}
              />
            )}
          />
          <FormField
            control={form.control}
            name="client.code"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <TextField
                    defaultValue={" "}
                    label="Codigo"
                    className=""
                    id="outlined-basic"
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="client.classification"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <TextField
                    defaultValue={" "}
                    label="Classificação"
                    id="outlined-basic"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client.identification"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <TextField
                    defaultValue={" "}
                    label="identificação"
                    id="outlined-basic"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="client.name"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <TextField
                    defaultValue={" "}
                    label="Nome"
                    id="outlined-basic"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="client.stateRegistration"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <TextField
                    defaultValue={" "}
                    label="Registro estadual"
                    id="outlined-basic"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="client.tell"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <TextField
                    defaultValue={" "}
                    label="Telefone"
                    id="outlined-basic"
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="relative rounded-md p-4 bg-white border-border border-[1px] flex flex-wrap gap-4 w-full flex-1 items-center">
          <span className="absolute top-[-13px] bg-white px-3">
            Informações
          </span>
          <FormField
            control={form.control}
            name="tablePrice"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <Autocomplete
                    disablePortal
                    id="Selecione"
                    key={"232sa6565a6w5d6a5sda5"}
                    getOptionLabel={(option) => option.name}
                    sx={{
                      flexGrow: 1,
                      minWidth: 230,
                    }}
                    options={options}
                    value={field.value}
                    onChange={(_, newValue) => {
                      field.onChange(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        key={`${params.id}`}
                        {...params}
                        label={"Tabela"}
                        error={
                          !options.some(
                            (option) =>
                              option.table ===
                              form.getValues("tablePrice").table
                          )
                        }
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="conveyor"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <TextField
                    defaultValue={" "}
                    label="Transportadora"
                    className=""
                    id="outlined-basic"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="planSell"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <TextField
                    defaultValue={" "}
                    label="Plano de venda"
                    className=""
                    id="outlined-basic"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="observation"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    placeholder="Observação"
                    className="resize-none"
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap">
            <div className="flex gap-10 flex-wrap ]">
              <Button
                type="submit"
                className="flex-grow-[1]"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex gap-2 items-center">
                    <Spinner className="w-5 h-5" />
                    Solicitando...
                  </div>
                ) : (
                  <div>Solicitar</div>
                )}
              </Button>
              <AddingProduct data={products} handleAddFn={addProductToForm} />
            </div>
            <p className="text-2xl font-bold flex max-[450px]:flex-grow-[1] max-[450px]:justify-center max-[450px]:text-4xl max-[450px]:mt-4">
              {value.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
          <FormField
            control={form.control}
            name="products"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <DataTableCart
                    columns={columnsProduct({
                      onDelete: handleDelete,
                    })}
                    data={field.value as any}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};
