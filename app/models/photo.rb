class Photo < ActiveRecord::Base
  belongs_to :album, :counter_cache => true
  belongs_to :user, :counter_cache => true

  has_many :comments
  
  has_attachment  :content_type => :image,
                  :storage => :file_system,
                  :max_size => 10.megabytes,
                  :thumbnails => {:view => '600x450', :list => "200", :thumb => [75,75]}
#                  :path_prefix => 'public/datafiles/albums'

  validates_as_attachment
  
  
  
#broken... horribly borken...  
  # 
  # def full_filename(thumbnail = nil)
  #   file_system_path = self.attachment_options[:path_prefix]
  #   folder = self.thumbnail.nil? ? 'original' : self.thumbnail
  #   if folder == 'original'
  #     File.join(RAILS_ROOT, file_system_path, self.album_id, folder, thumbnail_name_for(thumbnail))
  #   else
  #     File.join(RAILS_ROOT, file_system_path, self.album_id, folder, thumbnail_name_for(thumbnail))
  #   end
  # end
  
end
