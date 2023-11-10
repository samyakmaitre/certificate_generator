from flask import Flask, render_template, request, send_from_directory
import os
from PIL import Image, ImageDraw
import openpyxl

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_image', methods=['POST'])
def process_image():
    # Get the uploaded files
    image_file = request.files['imageUpload']
    excel_file = request.files['excelSheet']

    # Save the files to the upload folder
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'original_image.png')
    excel_path = os.path.join(app.config['UPLOAD_FOLDER'], 'coordinates.xlsx')

    image_file.save(image_path)
    excel_file.save(excel_path)

    # Process the image and add text
    edited_image_path = process_and_add_text(image_path, excel_path)

    # Send the edited image to the client
    return send_from_directory(app.config['UPLOAD_FOLDER'], edited_image_path, as_attachment=True)

def process_and_add_text(image_path, excel_path):
    image = Image.open(image_path)
    draw = ImageDraw.Draw(image)

    # Open the Excel file and get the coordinates
    workbook = openpyxl.load_workbook(excel_path)
    sheet = workbook.active

    for row in sheet.iter_rows(min_row=2, values_only=True):
        x, y, text = row
        draw.text((x, y), text, fill="red")

    edited_image_path = 'edited_image.png'
    edited_image_path = os.path.join(app.config['UPLOAD_FOLDER'], edited_image_path)
    image.save(edited_image_path)

    return edited_image_path

if __name__ == '__main__':
    app.run(debug=True)
