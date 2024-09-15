import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { AdminSchema, adminSchema } from "~/schemas/adminSchema";

interface Props {
  title: string;
  initialData?: AdminSchema;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  handleOnSubmit: (formData: AdminSchema) => void;
  isPending: boolean;
  triggerButton?: React.ReactNode;
  actionBtnContent: React.ReactNode;
  isSuccess: boolean;
}
function AdminDialog({
  title,
  initialData,
  isOpen,
  setIsOpen,
  handleOnSubmit,
  isPending,
  triggerButton,
  actionBtnContent,
  isSuccess,
}: Props) {
  const form = useForm<AdminSchema>({
    resolver: zodResolver(adminSchema),
    defaultValues: initialData ?? {
      email: "",
      fullName: "",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      form.reset();
    }
  }, [form, isSuccess]);

  const onSubmit = form.handleSubmit(handleOnSubmit);

  const disabledSubmitButton = !form.formState.isValid || isPending;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!!triggerButton && (
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form {...{ onSubmit }} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="admin-email">อีเมลล์</FormLabel>
                  <Input id="admin-email" className="col-span-3" {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="admin-name">ชื่อ</FormLabel>
                  <Input id="admin-name" className="col-span-3" {...field} />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                disabled={disabledSubmitButton}
                type="submit"
                className="gap-4"
              >
                {actionBtnContent}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminDialog;
