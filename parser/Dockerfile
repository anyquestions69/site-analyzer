FROM python:3.10.4

WORKDIR /parser 

#RUN apt update -y
RUN python -m pip install --upgrade pip

COPY . /parser

RUN pip3 install -r ./requirements.txt --verbose
RUN chmod +x /parser/wait-for-it.sh

CMD [ "python3", "/parser/consumer.py" ]