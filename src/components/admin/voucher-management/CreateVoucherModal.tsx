import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { voucherApi } from "@/api/voucher/voucher.api";
import { toast } from "sonner";

const formSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã voucher"),
  discount: z.coerce.number().min(1, "Vui lòng nhập giá trị giảm giá"),
  expiryDate: z.string().min(1, "Vui lòng chọn ngày hết hạn"),
  usageLimit: z.coerce.number().optional(),
  minOrderValue: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateVoucherModal({
  isOpen,
  onClose,
}: CreateVoucherModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      discount: 0,
      expiryDate: "",
      usageLimit: undefined,
      minOrderValue: undefined,
    },
  });

  const { mutate: createVoucher, isPending } = useMutation({
    mutationFn: voucherApi.createVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success(t("admin.vouchers.createSuccess"));
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast.error(t("common.error"));
      console.error(error);
    },
  });

  const onSubmit = (values: FormValues) => {
    createVoucher({
      ...values,
      expiryDate: new Date(values.expiryDate).toISOString(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            <span>{t("admin.vouchers.create")}</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.vouchers.form.code")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("admin.vouchers.form.codePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.vouchers.form.value")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("admin.vouchers.form.valuePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.vouchers.form.expiryDate")}</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.vouchers.form.usageLimit")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t(
                        "admin.vouchers.form.usageLimitPlaceholder"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minOrderValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("admin.vouchers.form.minOrderValue")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t(
                        "admin.vouchers.form.minOrderValuePlaceholder"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("common.creating") : t("admin.vouchers.create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
