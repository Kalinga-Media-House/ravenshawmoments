"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { EditProfileForm, EditProfileFormProps } from "./EditProfileForm";

export function EditProfileModalRoute({
  defaultValues,
}: {
  defaultValues: EditProfileFormProps["defaultValues"];
}) {
  const router = useRouter();

  const handleClose = () => {
    router.push("/dashboard/profile");
    router.refresh();
  };

  return (
    <EditProfileForm
      open={true}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      onSuccess={handleClose}
      defaultValues={defaultValues}
    />
  );
}
