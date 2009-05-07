class Session < ActiveRecord::Base
  def is_open
    return ((self.begin <=> Date.today) == -1)
  end
end
