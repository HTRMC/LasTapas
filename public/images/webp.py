from PIL import Image
import os

# Get the current working directory
directory = os.getcwd()

# List of valid image extensions
valid_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif']

# Loop through all files in the directory
for filename in os.listdir(directory):
    # Get the file extension
    file_ext = os.path.splitext(filename)[1].lower()
    
    # Check if the file is an image
    if file_ext in valid_extensions:
        # Open the image
        with Image.open(os.path.join(directory, filename)) as img:
            # Convert the filename to have a .webp extension
            webp_filename = os.path.splitext(filename)[0] + ".webp"
            
            # Convert and save the image as .webp
            img.save(os.path.join(directory, webp_filename), 'webp')
            print(f"Converted {filename} to {webp_filename}")

print("All valid images converted to .webp")
