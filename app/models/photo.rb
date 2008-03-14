class Photo < ActiveRecord::Base
  belongs_to :album, :counter_cache => true
  belongs_to :user, :counter_cache => true

  acts_as_attachment :storage => :file_system, :max_size => 5.megabytes, :content_type => :image
  validates_as_attachment

end
