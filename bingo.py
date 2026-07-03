import telebot
from telebot.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import threading

API_TOKEN = '8761110080:AAFGQk0NGXhEkyzjCjrD_zM9Zd9Aqfh4_g4'
bot = telebot.TeleBot(API_TOKEN)
app = Flask(__name__)
CORS(app)

WEB_APP_URL = "https://sele3314.github.io/marakibingo/"

game_state = {
    "jackpot": 856.00,
    "card_price": 10.00,
    "user_balance": 150.00,
    "drawn_numbers": [12, 43],
    "active_cards": {}
}

@app.route('/api/game-info', methods=['GET'])
def get_game_info():
    return jsonify(game_state)

@app.route('/api/buy-card', methods=['POST'])
def buy_card():
    if game_state['user_balance'] < game_state['card_price']:
        return jsonify({"success": False, "message": "የተቀማጭ ብርዎ በቂ አይደለም!"})
    game_state['user_balance'] -= game_state['card_price']
    game_state['jackpot'] += game_state['card_price'] * 0.8
    return jsonify({
        "success": True,
        "new_balance": game_state['user_balance'],
        "new_jackpot": game_state['jackpot']
    })

@bot.message_handler(commands=['start'])
def send_welcome(message):
    markup = ReplyKeyboardMarkup(row_width=1, resize_keyboard=True)
    web_app_button = KeyboardButton(
        text="🎮 ሁሉ ቢንጎ ጨዋታ ክፈት", 
        web_app=WebAppInfo(url=WEB_APP_URL)
    )
    markup.add(web_app_button)
    bot.send_message(
        message.chat.id, 
        "እንኳን ወደ ማራኪ ቢንጎ በደህና መጡ! 🎲\nከታች ያለውን ቁልፍ ተጭነው ይጫወቱ።", 
        reply_markup=markup
    )

def run_bot():
    print("የቴሌግራም ቦት መቆጣጠሪያ ሥራ ጀምሯል...")
    bot.infinity_polling()

if __name__ == '__main__':
    bot_thread = threading.Thread(target=run_bot)
    bot_thread.daemon = True
    bot_thread.start()
    print("የFlask API ሰርቨር በፖርት 5000 ላይ በመነሳት ላይ ነው...")
    app.run(debug=False, port=5000, host='0.0.0.0')
