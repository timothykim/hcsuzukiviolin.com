class Comment < ActiveRecord::Base
  belongs_to :user, :counter_cache => true
  belongs_to :photo, :counter_cache => true
  
  validates_presence_of     :content
  validates_presence_of     :user_id
  validates_presence_of     :photo_id
end
