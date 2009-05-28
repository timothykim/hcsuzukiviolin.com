class SessionDay < ActiveRecord::Base
  belongs_to :session

  def copy_by_offset(offset)

  end
end
