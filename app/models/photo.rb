class Photo < ActiveRecord::Base
  belongs_to :album, :counter_cache => true
  belongs_to :user, :counter_cache => true



end
