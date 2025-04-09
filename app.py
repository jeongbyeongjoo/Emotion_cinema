import streamlit as st

st.set_page_config(layout='wide')
st.title('emotion cinema')

data_list = []

title = st.selectbox('Choose a movie you like', list)
if st.button('Recommand'):
    pass