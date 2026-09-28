"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const ProvinceSelectionContext = createContext<{
  selectedProvince: string;
  selectProvince: (province: string) => void;
} | null>(null);

export function useProvinceSelection() {
  return useContext(ProvinceSelectionContext);
}

export default function ProvinceSelection({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedProvince, selectProvince] = useState("");
  return (
    <ProvinceSelectionContext.Provider
      value={{ selectedProvince, selectProvince }}
    >
      {children}
    </ProvinceSelectionContext.Provider>
  );
}
