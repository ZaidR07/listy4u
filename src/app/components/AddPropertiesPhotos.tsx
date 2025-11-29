"use client";
import { useState, useRef } from "react";

const AddPropertiesPhotos = (props: any) => {
  const {
    newImages,
    setNewImages,
    existingImages,
    onExistingImagesChange,
    removedImages,
    setRemovedImages,
    formdata,
    onImagesChange,
  } = props;

  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  // Support controlled (via newImages/setNewImages) and uncontrolled modes
  const isControlled = typeof setNewImages === "function";
  const [localNewImages, setLocalNewImages] = useState<any[]>([]);
  const currentNewImages = isControlled ? (newImages || []) : localNewImages;
  const setCurrentNewImages = isControlled ? setNewImages : setLocalNewImages;

  const handleFileChange = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = Array.from(event.target.files);
    if (!files.length) return;

    // Validate files
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    const validFiles = [];
    const invalidFiles = [];
    
    files.forEach((file: File) => {
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(`${file.name}: Invalid file type. Only JPEG, PNG, and WebP allowed.`);
      } else if (file.size > maxFileSize) {
        invalidFiles.push(`${file.name}: File too large. Maximum size is 5MB.`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      alert(`Some files were rejected:\n${invalidFiles.join('\n')}`);
    }

    if (validFiles.length === 0) return;

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));

    // Update new images in parent component
    const updatedImages = [...(currentNewImages || []), ...validFiles];
    setCurrentNewImages(updatedImages);
    // If consumer provided onImagesChange (legacy API), notify with updated list
    if (typeof onImagesChange === "function") {
      onImagesChange(updatedImages);
    }

    // Update preview URLs
    setPreviewUrls(prev => [...prev, ...newPreviews]);
    
    // Reset the file input to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-[2vh]">
      <section>
        <h2 className="text-lg text-[#FF5D00] mb-4">Property Images</h2>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Image Previews */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {/* Existing images */}
          {existingImages && existingImages.map((src, index) => (
            <div key={`existing-${index}`} className="relative">
              <img
                src={src}
                alt="Existing"
                className="w-24 h-24 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  // Add to removed images list
                  if (setRemovedImages && existingImages && existingImages[index]) {
                    setRemovedImages(prev => [...prev, existingImages[index]]);
                  }
                  
                  // Notify parent to remove from existing images
                  if (onExistingImagesChange) {
                    onExistingImagesChange(index);
                  }
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          {/* New image previews */}
          {previewUrls.map((src, index) => (
            <div key={`new-${index}`} className="relative">
              <img
                src={src}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  // Remove from new images
                  const updatedNewImages = (currentNewImages || []).filter((_, i) => i !== index);
                  setCurrentNewImages(updatedNewImages);
                  if (typeof onImagesChange === "function") {
                    onImagesChange(updatedNewImages);
                  }
                  
                  // Remove preview URL
                  const updatedPreviewUrls = previewUrls.filter((_, i) => i !== index);
                  setPreviewUrls(updatedPreviewUrls);
                  
                  // Revoke the object URL to free memory
                  URL.revokeObjectURL(src);
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add Images Button */}
        <button
          type="button"
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded-md"
          onClick={triggerFileInput}
        >
          {((existingImages?.length || 0) + ((currentNewImages?.length || 0))) > 0 ? 'Add More Images' : 'Add Images'}
        </button>
      </section>
    </div>
  );
};

export default AddPropertiesPhotos;