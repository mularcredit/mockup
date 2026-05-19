import os
import sys

def main():
    pdf_path = "/Users/mac/Desktop/Ziranew/zirapro/Zira _ T&A.pdf"
    output_md_path = "/Users/mac/.gemini/antigravity/brain/952965fc-52c2-457f-9978-a3656a95f9b0/zira_ta_specs.md"

    # Make sure output directory exists
    os.makedirs(os.path.dirname(output_md_path), exist_ok=True)

    print(f"Checking for libraries to extract text from: {pdf_path}")
    try:
        import pypdf
    except ImportError:
        print("pypdf not found. Installing via pip...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
        import pypdf

    print("Extracting text...")
    reader = pypdf.PdfReader(pdf_path)
    extracted_text = []

    extracted_text.append("# ZiraHR Time & Attendance (T&A) Module Specifications\n")
    extracted_text.append(f"Auto-extracted from `Zira _ T&A.pdf`.\n\n")

    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        extracted_text.append(f"## --- Page {i+1} ---\n")
        extracted_text.append(text)
        extracted_text.append("\n\n")

    full_content = "".join(extracted_text)

    with open(output_md_path, "w", encoding="utf-8") as f:
        f.write(full_content)

    print(f"Successfully extracted specifications to: {output_md_path}")

if __name__ == "__main__":
    main()
