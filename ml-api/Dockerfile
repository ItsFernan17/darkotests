FROM orgoro/dlib-opencv-python

LABEL maintainer="UMG Huehuetenango Grupo No. 3 Darkotest" \
      version="1.0" \
      description="Contenedor para el backend ML API con Dlib y OpenCV"

WORKDIR /app

COPY . .

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
