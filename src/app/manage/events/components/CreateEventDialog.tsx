"use client";

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
import {
  type CreateEventSchema,
  createEventSchema,
} from "~/schemas/createEventSchema";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "~/wrapper/QueryWrapper";
import { createEventFn } from "~/requests/event";
import { AxiosError } from "axios";
import { useState } from "react";

export default function CreateEventDialog() {
  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      date: new Date(),
      place: "",
      owner: "",
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const createEvent = useMutation({
    mutationFn: createEventFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const handleOnSubmit = async (formData: CreateEventSchema) => {
    try {
      await createEvent.mutateAsync(formData);
      toast.success("สร้างอีเวนต์สำเร็จ");
      setDialogOpen(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        const { response } = err;
        if (response?.data.code === "EVENT_ALREADY_EXISTS") {
          toast.error("เกิดข้อผิดพลาด", {
            description: "อีเวนต์นี้มีอยู่แล้ว",
          });
        }
      }
    }
  };

  const onSubmit = form.handleSubmit(handleOnSubmit);

  const disabledSubmitButton = !form.formState.isValid || createEvent.isPending;

  return (
    <>
      <Button onClick={() => setDialogOpen(true)} className="w-full gap-4 my-4">
        <CirclePlus size="1.25rem" /> สร้างอีเวนต์ใหม่
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                  <CirclePlus size="1.25rem" />
                  สร้าง
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
