class Avatar < ActiveRecord::Base
  belongs_to :user

  has_attachment :content_type => :image, 
                 :storage => :file_system, 
                 :max_size => 2.megabytes,
                 :thumbnails => { :thumb => [50,50] },
                 :path_prefix => 'public/datafiles/avatars'

  validates_as_attachment



end
