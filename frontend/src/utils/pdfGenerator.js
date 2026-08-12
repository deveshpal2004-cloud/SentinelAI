import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadReport = (result) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("SentinelAI Emergency Report", 20, 20);

  autoTable(doc, {
    startY: 35,
    head: [["Category", "Details"]],
    body: [
      ["Incident", result.situation?.incident_type || "-"],
      ["Severity", result.situation?.severity || "-"],
      ["Situation", result.situation?.summary || "-"],
      ["Hospital", result.hospital?.hospital_type || "-"],
      ["Ambulances", result.hospital?.ambulances || "-"],
      ["Traffic", result.traffic?.road_closure || "-"],
      [
        "Public Alert",
        result.alert?.response || result.alert?.alert || "-"
      ]
    ]
  });

  doc.save("SentinelAI_Report.pdf");
};