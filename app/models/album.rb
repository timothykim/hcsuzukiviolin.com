class Album < ActiveRecord::Base
  belongs_to      :user, :counter_cache => true
  has_many        :photos
  has_one         :key_photo, :foreign_key => "key_photo_id"
  
  validates_presence_of     :name
  validates_presence_of     :user_id
  
end
