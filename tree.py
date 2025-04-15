import os
from pathlib import Path


def generate_tree(directory, prefix="", exclude_dirs=None):
    if exclude_dirs is None:
        exclude_dirs = []

    result = []

    # Get all items in the directory
    path = Path(directory)
    items = sorted(list(path.iterdir()), key=lambda x: (not x.is_dir(), x.name.lower()))

    # Count how many items we'll process (excluding the ones we want to skip)
    filtered_items = [
        item for item in items if not (item.is_dir() and item.name in exclude_dirs)
    ]
    count = len(filtered_items)

    # Process each item
    for i, item in enumerate(filtered_items):
        is_last = i == count - 1

        # Print the current item
        connector = "└── " if is_last else "├── "
        result.append(f"{prefix}{connector}{item.name}")

        # Recursively print subdirectories
        if item.is_dir():
            next_prefix = prefix + ("    " if is_last else "│   ")
            result.extend(generate_tree(item, next_prefix, exclude_dirs))

    return result


# Directories to exclude
exclude = [
    "node_modules",
    ".git",
    ".vs",
    "__pycache__",
    "venv",
    ".idea",
    "dist",
    "build",
    ".next",
    ".github",
    ".vscode",
]
# Get current directory
current_dir = os.getcwd()
header = f"Directory tree for: {current_dir}\n"

# Generate the tree
tree_lines = generate_tree(current_dir, exclude_dirs=exclude)

# Write to file
output_file = "directory_tree.txt"
with open(output_file, "w") as f:
    f.write(header)
    f.write("\n".join(tree_lines))

print(f"Directory tree has been saved to {output_file}")
