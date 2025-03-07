#!/bin/bash
tail -n 100 skyprompt_output.log
if grep -q "panic" skyprompt_output.log; then
  echo "CLI crashed"
  exit 1
fi
if ! grep -q "Server starting on 127.0.0.1:3030" skyprompt_output.log; then
  echo "Server did not start correctly"
  exit 1
fi
if grep -q "No windows found" skyprompt_output.log; then
  echo "No windows were detected"
  exit 1
fi
if grep -q "tesseract not found" skyprompt_output.log; then
  echo "Tesseract OCR not found"
  exit 1
fi
echo "CLI ran successfully without crashing"
