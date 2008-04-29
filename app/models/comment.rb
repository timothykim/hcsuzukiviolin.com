class Comment < ActiveRecord::Base
  belongs_to :user, :counter_cache => true
  belongs_to :photo, :counter_cache => true
  
  validates_presence_of     :content
  validates_presence_of     :user_id
  validates_presence_of     :photo_id
  
  before_save   :strip_html
  
  def strip_html
    self.content = self.content.gsub(/<\/?[^>]*>/, "")
  end
end
