import { CirclePlus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/datepicker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type EventSchema, eventSchema } from "~/schemas/eventSchema";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { useEffect, type ReactNode } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";

interface Props {
  triggerButton: ReactNode;
  handleOnSubmit: (formData: EventSchema) => void;
  isPending: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  initialData?: EventSchema;
  actionBtnContent: ReactNode;
  isSuccess: boolean;
}

export default function EventDialog({
  triggerButton,
  handleOnSubmit,
  isPending,
  isOpen,
  setIsOpen,
  initialData,
  actionBtnContent,
  isSuccess,
}: Props) {
  const form = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData ?? {
      name: "",
      date: new Date(),
      place: "",
    },
  });

  useEffect(() => {
    if (!initialData) return;
    form.reset(initialData);
  }, [initialData, form]);

  const onSubmit = form.handleSubmit(handleOnSubmit);

  const disabledSubmitButton = !form.formState.isValid || isPending;

  useEffect(() => {
    if (isSuccess) {
      form.reset();
    }
  }, [isSuccess, form]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] flex flex-col">
          <DialogHeader>
            <DialogTitle>สร้างอีเวนต์ใหม่</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form {...{ onSubmit }} className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="event-name">ชื่ออีเวนต์</FormLabel>
                    <Input id="event-name" className="col-span-3" {...field} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="event-date">วันที่</FormLabel>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="event-date">สถานที่</FormLabel>
                    <Input id="event-date" className="col-span-3" {...field} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="event-owner">ผู้รับผิดชอบ</Label>
                    <Input id="event-owner" className="col-span-3" {...field} />
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
    </>
  );
}
