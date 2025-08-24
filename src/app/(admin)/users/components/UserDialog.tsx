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
import { UserSchema, userSchema } from "~/schemas/userSchema";

interface Props {
  title: string;
  initialData?: UserSchema;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  handleOnSubmit: (formData: UserSchema) => void;
  isPending: boolean;
  triggerButton?: React.ReactNode;
  actionBtnContent: React.ReactNode;
  isSuccess: boolean;
}
function UserDialog({
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
  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData ?? {
      student_code: "",
      full_name: "",
      gmail: "",
      major: "",
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
              name="student_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="student-code">รหัสนิสิต</FormLabel>
                  <Input id="student-code" className="col-span-3" {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="student-full-name">ชื่อ</FormLabel>
                  <Input
                    id="student-full-name"
                    className="col-span-3"
                    {...field}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="student-email">อีเมลล์</FormLabel>
                  <Input id="student-email" className="col-span-3" {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="major"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="student-major">รหัสสาขา</FormLabel>
                  <Input id="student-major" className="col-span-3" {...field} />
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

export default UserDialog;
