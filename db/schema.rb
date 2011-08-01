# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110801215840) do

  create_table "albums", :force => true do |t|
    t.string   "name",         :limit => 80
    t.integer  "user_id"
    t.integer  "key_photo_id"
    t.boolean  "is_public",                  :default => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "photos_count",               :default => 0,     :null => false
    t.text     "description"
  end

  create_table "announcements", :force => true do |t|
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "avatars", :force => true do |t|
    t.integer "user_id"
    t.integer "parent_id"
    t.string  "content_type"
    t.string  "filename"
    t.string  "thumbnail"
    t.integer "size"
    t.integer "width"
    t.integer "height"
  end

  create_table "chms_registrations", :force => true do |t|
    t.string   "firstname"
    t.string   "lastname"
    t.string   "email"
    t.string   "address"
    t.string   "home_phone"
    t.string   "work_phone"
    t.string   "mobile_phone"
    t.string   "student_firstname"
    t.string   "student_lastname"
    t.date     "student_dob"
    t.text     "comments"
    t.string   "chms_hours"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "comments", :force => true do |t|
    t.integer  "user_id"
    t.integer  "photo_id"
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "lessons", :force => true do |t|
    t.integer  "registration_id"
    t.datetime "time"
    t.boolean  "is_recurring"
    t.integer  "duration"
    t.integer  "location_id"
  end

  create_table "locations", :force => true do |t|
    t.integer  "school_id"
    t.string   "room"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "login_logs", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "newsletters", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "options", :force => true do |t|
    t.string "name"
    t.string "value"
  end

  create_table "photos", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "album_id"
    t.integer  "user_id"
    t.string   "content_type"
    t.string   "filename"
    t.integer  "size"
    t.integer  "parent_id"
    t.string   "thumbnail"
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "comments_count", :default => 0, :null => false
  end

  create_table "registered_dates", :force => true do |t|
    t.integer "registration_id"
    t.time    "start"
    t.time    "end"
    t.text    "user_input",      :default => ""
    t.boolean "preferred",       :default => false
    t.date    "date"
  end

  create_table "registered_days", :force => true do |t|
    t.integer "registration_id"
    t.integer "day"
    t.time    "start"
    t.time    "end"
    t.text    "user_input",      :default => ""
    t.boolean "preferred",       :default => false
  end

  create_table "registered_group_classes", :force => true do |t|
    t.integer "registration_id"
    t.date    "class_date"
  end

  create_table "registered_options", :force => true do |t|
    t.integer "registration_id"
    t.integer "option_id"
    t.text    "value",           :default => ""
  end

  create_table "registration_options", :force => true do |t|
    t.integer "session_id"
    t.text    "text"
    t.string  "input_type"
  end

  create_table "registrations", :force => true do |t|
    t.integer  "student_id"
    t.integer  "school_id"
    t.integer  "session_id"
    t.integer  "lesson_duration"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "confirmed",       :default => false
  end

  create_table "sbc_registrations", :force => true do |t|
    t.integer  "student_id"
    t.boolean  "approved",   :default => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "schools", :force => true do |t|
    t.string "name"
    t.string "address"
    t.string "zip"
  end

  create_table "session_days", :force => true do |t|
    t.integer "session_id"
    t.date    "date"
    t.boolean "offday"
    t.boolean "group"
    t.text    "note"
  end

  create_table "session_group_lessons", :force => true do |t|
    t.integer "session_id"
    t.date    "day"
  end

  create_table "session_off_days", :force => true do |t|
    t.integer "session_id"
    t.date    "day"
    t.text    "note"
  end

  create_table "sessions", :force => true do |t|
    t.string  "name"
    t.date    "first"
    t.date    "last"
    t.boolean "is_active"
    t.text    "registration_notes"
    t.integer "registration_type"
    t.date    "due_date"
    t.boolean "is_ready",           :default => false
  end

  create_table "students", :force => true do |t|
    t.integer "user_id"
    t.string  "first_name"
    t.string  "middle_initial", :limit => 1
    t.string  "last_name"
    t.date    "dob"
    t.text    "comment"
    t.string  "school"
    t.string  "grade_level"
  end

  create_table "summer_schools", :force => true do |t|
    t.string "name"
  end

  create_table "summer_student_schedules", :force => true do |t|
    t.integer  "summer_student_id"
    t.datetime "begin"
    t.datetime "end"
    t.datetime "selected"
  end

  create_table "summer_students", :force => true do |t|
    t.string   "name"
    t.integer  "summer_school_id"
    t.integer  "lesson_duration"
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
    t.integer  "comments_count",                          :default => 0,     :null => false
    t.string   "alternate_email",                         :default => ""
    t.string   "home_phone",                              :default => ""
    t.string   "work_phone",                              :default => ""
    t.string   "mobile_phone",                            :default => ""
    t.text     "address",                                 :default => ""
  end

  create_table "weekly_availablities", :force => true do |t|
    t.integer "session_id"
    t.integer "school_id"
    t.integer "day"
    t.time    "start"
    t.time    "end"
    t.text    "user_input", :default => ""
  end

end
