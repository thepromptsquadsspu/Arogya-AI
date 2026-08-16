import jsPDF from 'jspdf';

export const generatePDFReport = (triageData, reportedSymptoms) => {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Colors
  const primaryColor = '#0891b2'; // Cyan-600
  const darkColor = '#0f172a';

  // Title Header
  doc.setFillColor(8, 145, 178); // Cyan background
  doc.rect(0, 0, 210, 28, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('AegisMed - Triage Advisor Report', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${dateStr}`, 140, 18);

  let yPos = 38;

  // Medical Disclaimer Warning
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(239, 68, 68);
  doc.rect(14, yPos, 182, 18, 'FD');
  
  doc.setTextColor(185, 28, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('MEDICAL DISCLAIMER:', 18, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('This document is an educational triage summary and NOT a formal medical diagnosis.', 18, yPos + 12);
  
  yPos += 26;

  // Urgency Banner
  const urgency = triageData.primary_urgency || 'Consult GP';
  if (urgency === 'Emergency') {
    doc.setFillColor(239, 68, 68);
  } else if (urgency === 'Consult GP') {
    doc.setFillColor(245, 158, 11);
  } else {
    doc.setFillColor(16, 185, 129);
  }
  doc.rect(14, yPos, 182, 16, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`RECOMMENDED URGENCY LEVEL: ${triageData.urgency_level || urgency}`, 18, yPos + 11);

  yPos += 24;

  // Reported Symptoms Section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Reported Symptoms', 14, yPos);
  
  yPos += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const symText = reportedSymptoms.map(s => s.replace(/_/g, ' ')).join(', ');
  doc.text(symText || 'None specified', 14, yPos);

  yPos += 14;

  // Top Predicted Conditions Section
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Top Predicted Conditions', 14, yPos);
  yPos += 8;

  const predictions = triageData.top_predictions || [];
  predictions.forEach((pred, idx) => {
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(248, 250, 252);
    doc.rect(14, yPos, 182, 32, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(14, yPos, 182, 32, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(8, 145, 178);
    doc.text(`${idx + 1}. ${pred.name} (${pred.confidence}% Confidence)`, 18, yPos + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`Category: ${pred.urgency_level}`, 18, yPos + 15);
    doc.text(`Matched Symptoms: ${pred.matched_symptoms.join(', ') || 'General overlap'}`, 18, yPos + 22);
    doc.text(`Recommendation: ${pred.recommendation.substring(0, 85)}...`, 18, yPos + 28);

    yPos += 36;
  });

  // Recommendations Summary
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. Summary Action Recommendation', 14, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const recLines = doc.splitTextToSize(triageData.summary_recommendation || '', 180);
  doc.text(recLines, 14, yPos);

  // Save File
  doc.save(`AegisMed_Triage_Report_${Date.now()}.pdf`);
};
