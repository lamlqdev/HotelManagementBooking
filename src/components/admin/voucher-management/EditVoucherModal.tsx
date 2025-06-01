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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { voucherApi } from "@/api/voucher/voucher.api";
import { toast } from "sonner";
import { Voucher } from "@/types/voucher";

const formSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã voucher"),
  discount: z.coerce
    .number()
    .min(0, "Giá trị giảm giá phải lớn hơn hoặc bằng 0"),
  expiryDate: z.string().min(1, "Vui lòng chọn ngày hết hạn"),
  usageLimit: z.coerce
    .number()
    .min(0, "Số lượt sử dụng phải lớn hơn hoặc bằng 0")
    .optional(),
  minOrderValue: z.coerce
    .number()
    .min(0, "Giá trị đơn tối thiểu phải lớn hơn hoặc bằng 0")
    .optional(),
  discountType: z.enum(["percentage", "fixed"]).default("percentage"),
  maxDiscount: z.coerce
    .number()
    .min(0, "Giá trị giảm tối đa phải lớn hơn hoặc bằng 0")
    .nullable()
    .optional(),
  startDate: z.string().optional(),
  status: z.enum(["active", "inactive", "expired"]).default("active"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: Voucher;
}

export default function EditVoucherModal({
  isOpen,
  onClose,
  voucher,
}: EditVoucherModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: voucher.code || "",
      discount: voucher.discount || 0,
      expiryDate: voucher.expiryDate
        ? String(voucher.expiryDate).split("T")[0]
        : "",
      usageLimit: voucher.usageLimit,
      minOrderValue: voucher.minOrderValue,
      discountType: voucher.discountType || "percentage",
      maxDiscount: voucher.maxDiscount ?? null,
      status: voucher.status || "active",
    },
  });

  const { mutate: updateVoucher, isPending } = useMutation({
    mutationFn: (values: FormValues) =>
      voucherApi.updateVoucher(voucher._id, {
        ...values,
        expiryDate: new Date(values.expiryDate).toISOString(),
        maxDiscount:
          values.discountType === "percentage" ? values.maxDiscount : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success(t("admin.vouchers.updateSuccess"));
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast.error(t("admin.vouchers.updateError"));
      console.error(error);
    },
  });

  const onSubmit = (values: FormValues) => {
    updateVoucher(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            <span>{t("admin.vouchers.edit")}</span>
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
                      disabled
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
              name="discountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.vouchers.form.discountType")}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("admin.vouchers.form.discountType")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">
                          {t("admin.vouchers.form.discountTypePercentage")}
                        </SelectItem>
                        <SelectItem value="fixed">
                          {t("admin.vouchers.form.discountTypeFixed")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("discountType") === "percentage" && (
              <FormField
                control={form.control}
                name="maxDiscount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("admin.vouchers.form.maxDiscount")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t(
                          "admin.vouchers.form.maxDiscountPlaceholder"
                        )}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.vouchers.form.status")}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("admin.vouchers.form.status")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          {t("admin.vouchers.status.active")}
                        </SelectItem>
                        <SelectItem value="inactive">
                          {t("admin.vouchers.status.inactive")}
                        </SelectItem>
                        <SelectItem value="expired">
                          {t("admin.vouchers.status.expired")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                {isPending ? t("common.saving") : t("common.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
