import html2canvas from 'html2canvas';

/**
 * Captures an HTML element at a simulated 300 DPI (approx 3.125x scale of 96 DPI).
 * Returns a Blob containing the PNG image.
 */
export async function captureHighResImage(element: HTMLElement): Promise<Blob | null> {
  // Save original styles
  const originalTransform = element.style.transform;
  const originalTransformOrigin = element.style.transformOrigin;

  try {
    // A standard screen is ~96 DPI. 300/96 = 3.125 scale factor.
    // However, html2canvas supports a `scale` option natively!
    // Using the built-in scale option is much safer than manipulating CSS transforms.
    const canvas = await html2canvas(element, {
      scale: 3.125, 
      useCORS: true,
      backgroundColor: null, // Keep transparency if any, or set to '#ffffff' if needed
      logging: false,
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  } catch (error) {
    console.error("Error capturing high-res image:", error);
    return null;
  } finally {
    // Restore original styles just in case (though we didn't end up changing them here)
    element.style.transform = originalTransform;
    element.style.transformOrigin = originalTransformOrigin;
  }
}
