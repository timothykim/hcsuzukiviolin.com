# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of ActiveRecord to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 5) do

  create_table "albums", :force => true do |t|
    t.string   "name",         :limit => 80
    t.integer  "user_id"
    t.integer  "key_photo_id"
    t.boolean  "is_public",                  :default => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "photos_count",               :default => 0,     :null => false
  end

  create_table "options", :force => true do |t|
    t.string "name"
    t.string "value"
  end

  create_table "photos", :force => true do |t|
    t.string   "name",         :limit => 80
    t.text     "caption"
    t.integer  "album_id"
    t.integer  "user_id"
    t.string   "content_type"
    t.string   "filename"
    t.integer  "size"
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "firstname"
    t.string   "lastname"
    t.string   "login"
    t.string   "email"
    t.string   "crypted_password",          :limit => 40
    t.string   "salt",                      :limit => 40
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token"
    t.datetime "remember_token_expires_at"
    t.boolean  "is_admin",                                :default => false
    t.boolean  "activated",                               :default => false
    t.integer  "albums_count",                            :default => 0,     :null => false
    t.integer  "photos_count",                            :default => 0,     :null => false
  end

end
