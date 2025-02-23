# syntax=docker/dockerfile:1

FROM python:3.10-buster

WORKDIR /app

RUN pip install pipenv

COPY Pipfile .
COPY Pipfile.lock .

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

RUN pipenv install --system --deploy

COPY . .

EXPOSE 80

CMD ["./start.sh"]

