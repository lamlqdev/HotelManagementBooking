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
  discountType: z.enum(["percentage", "fixed"]).default("fixed"),
  maxDiscount: z.coerce
    .number()
    .min(0, "Giá trị giảm tối đa phải lớn hơn hoặc bằng 0")
    .nullable()
    .optional(),
  applicableTiers: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MEMBERSHIP_TIERS = ["Gold", "Silver", "Bronze"];

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
      discountType: "fixed",
      maxDiscount: null,
      applicableTiers: [],
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
      toast.error(t("admin.vouchers.createError"));
      console.error(error);
    },
  });

  const onSubmit = (values: FormValues) => {
    createVoucher({
      ...values,
      expiryDate: new Date(values.expiryDate).toISOString(),
      startDate: new Date().toISOString(),
      status: "active",
      maxDiscount:
        values.discountType === "percentage" ? values.maxDiscount : null,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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

            {/* Hạng thành viên áp dụng */}
            <FormField
              control={form.control}
              name="applicableTiers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    {t("admin.vouchers.form.applicableTiers")}
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant={
                            field.value?.length === MEMBERSHIP_TIERS.length
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            if (
                              field.value?.length === MEMBERSHIP_TIERS.length
                            ) {
                              field.onChange([]);
                            } else {
                              field.onChange(MEMBERSHIP_TIERS);
                            }
                          }}
                        >
                          {field.value?.length === MEMBERSHIP_TIERS.length
                            ? t("common.deselectAll")
                            : t("common.selectAll")}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {MEMBERSHIP_TIERS.map((tier) => (
                          <div
                            key={tier}
                            className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                              field.value?.includes(tier)
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => {
                              const currentTiers = field.value || [];
                              if (currentTiers.includes(tier)) {
                                field.onChange(
                                  currentTiers.filter((t) => t !== tier)
                                );
                              } else {
                                field.onChange([...currentTiers, tier]);
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="font-medium">
                                  {t(
                                    `admin.vouchers.tiers.${tier.toLowerCase()}`
                                  )}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {t(
                                    `admin.vouchers.tiers.${tier.toLowerCase()}Description`
                                  )}
                                </p>
                              </div>
                              <div className="h-4 w-4 rounded-full border flex items-center justify-center">
                                {field.value?.includes(tier) && (
                                  <div className="h-2 w-2 rounded-full bg-primary" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
