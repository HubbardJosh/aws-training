import React, { createContext, useContext, useState } from "react";
import { setActiveCert } from "../components/AbbreviatedText";

export type CertificationId = "dva-c02" | "clf-c02" | "aif-c01";

export interface CertMeta {
  id: CertificationId;
  name: string;
  fullName: string;
  examInfo: string;
  icon: string;
  color: string;
  storageKey: string;
}

export const CERT_META: Record<CertificationId, CertMeta> = {
  "dva-c02": {
    id: "dva-c02",
    name: "DVA-C02",
    fullName: "AWS Certified Developer – Associate",
    examInfo: "65 questions · 130 min · Passing score: 720/1000",
    icon: "code-slash",
    color: "#FF9900",
    storageKey: "aws_training_progress_dva",
  },
  "clf-c02": {
    id: "clf-c02",
    name: "CLF-C02",
    fullName: "AWS Certified Cloud Practitioner",
    examInfo: "65 questions · 90 min · Passing score: 700/1000",
    icon: "cloud",
    color: "#4A90E2",
    storageKey: "aws_training_progress_clf",
  },
  "aif-c01": {
    id: "aif-c01",
    name: "AIF-C01",
    fullName: "AWS Certified AI Practitioner",
    examInfo: "85 questions · 120 min · Passing score: 700/1000",
    icon: "hardware-chip",
    color: "#7B61FF",
    storageKey: "aws_training_progress_aif",
  },
};

interface CertContextValue {
  certId: CertificationId;
  certMeta: CertMeta;
  setCert: (id: CertificationId) => void;
}

const CertContext = createContext<CertContextValue>({
  certId: "dva-c02",
  certMeta: CERT_META["dva-c02"],
  setCert: () => {},
});

export function CertProvider({ children }: { children: React.ReactNode }) {
  const [certId, setCertId] = useState<CertificationId>("dva-c02");

  const setCert = (id: CertificationId) => {
    setCertId(id);
    setActiveCert(id);
  };

  return (
    <CertContext.Provider
      value={{ certId, certMeta: CERT_META[certId], setCert }}
    >
      {children}
    </CertContext.Provider>
  );
}

export function useCert() {
  return useContext(CertContext);
}
