class Album < ActiveRecord::Base
  belongs_to :user
  has_many :photo
  has_one :photo, :foreign_key => "key_photo_id"
end
