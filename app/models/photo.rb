class Photo < ActiveRecord::Base
  belongs_to :album, :counter_cache => true
  belongs_to :user, :counter_cache => true

  has_attachment  :content_type => :image,
                  :storage => :file_system,
                  :max_size => 10.megabytes,
                  :thumbnails => {:view => '500', :list => '200', :crop => [75,75]}

  validates_as_attachment
  
end
