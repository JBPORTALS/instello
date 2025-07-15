"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@instello/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@instello/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@instello/ui/components/form";
import { Textarea } from "@instello/ui/components/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const InviteFacultySchema = z.object({
  emails: z
    .string()
    .min(1, "Required")
    .check((ctx) => {
      const invalidEmails: string[] = [];

      ctx.value.split(",").forEach((email) => {
        if (!emailRegex.test(email.trim())) invalidEmails.push(email.trim());
      });

      if (invalidEmails.length > 0)
        ctx.issues.push({
          code: "invalid_value",
          input: ctx.value,
          values: [],
          message: `${invalidEmails.join(", ")} invalid`,
        });
    }),
});

export function InviteMemberButton() {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(InviteFacultySchema),
    defaultValues: {
      emails: "",
    },
    mode: "onChange",
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutateAsync: createInvitationBulk } = useMutation(
    trpc.organization.createInvitationBulk.mutationOptions({
      async onSuccess(data) {
        await queryClient.invalidateQueries(trpc.organization.pathFilter());
        toast.success(`${data.length} members invited`);
        form.reset();
        setOpen(false);
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  async function onSubmit(values: z.infer<typeof InviteFacultySchema>) {
    const invitationsBulkInput = values.emails
      .split(",")
      .map((e) => e.trim())
      .map((emailAddress) => ({
        emailAddress,
        role: "org:staff",
      }));

    await createInvitationBulk(invitationsBulkInput);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite to your organizatoin</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody>
              <div className="grid">
                <FormField
                  control={form.control}
                  name="emails"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          rows={3}
                          className="resize-none"
                          placeholder="email@example.com, email2@example.com..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button loading={form.formState.isSubmitting}>
                Send invites...
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
