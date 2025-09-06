## UI Acceptance Checklist

- Landing LCP ≤ 2.5s (Mobile Lighthouse): [run locally and paste score]
- Create flow blocks Generate until selfie + text + consent valid
- Progress stepper advances through stages (mock API): uploading → queued → processing → assembling → ready
- Preview shows 9:16 video, watermark visible
- Download button triggers file download (mock URL OK)
- Library lists saved items and supports Download/Delete/Duplicate
- Keyboard-only path works; tab order logical; progress announced via ARIA live region
- UploadDropzone shows validation errors and has visible focus ring
- Offline banner appears when offline
- Dark mode legible; focus rings visible; controls ≥ 48px touch target

How to test locally:

```
npm i
npm run dev
```


